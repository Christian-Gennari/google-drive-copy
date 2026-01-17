import express from "express";
import type { Request, Response, Application } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import helmet from "helmet";
import { DbService } from "./db.service.js";
import type { FileDto } from "../../shared/file.dto.js";
import fuzzysort from "fuzzysort";
import { CONFIG } from "./config.js";

const app: Application = express();
const PORT = CONFIG.port;

const isProduction = process.env.NODE_ENV === "production";
const UPLOADS_DIR = CONFIG.paths.uploads;
const ANGULAR_DIST_PATH = CONFIG.paths.angularDist;

// --- SECURITY & CONFIG ---
app.use(helmet());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// --- STATIC FILES ---
if (isProduction) {
  app.use(express.static(ANGULAR_DIST_PATH));
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// --- ROUTES ---

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    message: "API ok",
    mode: isProduction ? "Production" : "Development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/files", async (req: Request, res: Response) => {
  const files = await DbService.getAllFiles();

  if (!files) {
    return res.status(200).json([]);
  }
  res.status(200).json(files);
});

app.get("/api/files/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;

  if (!filename || filename.includes("/") || filename.includes("\\")) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  const fullPath = path.join(UPLOADS_DIR, filename);

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "File not found on disk" });
  }

  res.status(200).sendFile(fullPath);
});

// POST: Upload a new file
// Uses 'upload.single' to stream the file directly to disk
app.post(
  "/api/files",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const file = req.file;
    const body = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const fileToSave: FileDto = {
        fileName: file.filename,
        ownerName: body.ownerName || "Unknown",
        uploadedAt: new Date().toISOString(),
        editedAt: new Date().toISOString(),
        sizeInBytes: file.size,
      };

      await DbService.upsertFile(fileToSave);

      res.status(200).json({
        message: "File uploaded successfully",
        filename: file.filename,
        sizeInBytes: file.size,
      });
    } catch (error) {
      console.error("Upload failed, cleaning up...", error);
      // CRITICAL: Delete the file if DB save fails to prevent "ghost" files
      if (file && file.path) {
        fs.unlinkSync(file.path);
      }
      res.status(500).json({ error: "Failed to save file metadata" });
    }
  },
);

app.delete("/api/files/:filename", async (req: Request, res: Response) => {
  const filename = req.params.filename;
  const files = await DbService.getAllFiles();

  if (!files) return res.status(404).json({ error: "File not found!" });
  if (!filename) return res.status(400).json({ error: "No filename provided" });

  const index = files.findIndex((file) => file.fileName === filename);

  if (index === -1) {
    return res.status(404).json({ error: "File not found!" });
  }

  files.splice(index, 1);
  await DbService.updateListOfFiles(files);

  const fullPath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }

  res.status(200).json({ message: "File deleted", filename });
});

app.get("/api/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query || query.trim().length === 0) {
    return res.status(200).json([]);
  }

  const files = await DbService.getAllFiles();
  if (!files || files.length === 0) return res.status(200).json([]);

  const threshold = query.length < 3 ? -300 : -500;

  const results = fuzzysort.go(query, files, {
    keys: ["fileName"],
    threshold,
  });

  const matches = results.map((r) => r.obj);
  res.status(200).json(matches);
});

if (isProduction) {
  app.get("/{*path}", (req: Request, res: Response) => {
    res.sendFile(path.join(ANGULAR_DIST_PATH, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[server]: Backend API running on http://localhost:${PORT}`);
  console.log(
    `[server]: Environment mode: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`,
  );
});
