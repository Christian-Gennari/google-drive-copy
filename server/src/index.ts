import express from "express";
import type { Request, Response, Application } from "express";
import path from "path";
import fs from "fs";
import { DbService } from "./db.service.js";
import type { FileDto } from "../../shared/file.dto.js";
import fuzzysort from "fuzzysort";
import { CONFIG } from "./config.js";

const app: Application = express();
const PORT = CONFIG.port;

// Determine if we are in production mode
const isProduction = process.env.NODE_ENV === "production";

// Use variables from config
const UPLOADS_DIR = CONFIG.paths.uploads;
const ANGULAR_DIST_PATH = CONFIG.paths.angularDist;

// We use JSON because we are sending a DTO.
// Increased limit to 1000mb to handle large Base64 strings.
app.use(express.json({ limit: "1000mb" }));

// --- PRODUCTION ONLY: Serve Static Files ---
// In Dev, we rely on 'ng serve' (proxy), so we don't serve these.
if (isProduction) {
  app.use(express.static(ANGULAR_DIST_PATH));
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    message: "API ok",
    mode: isProduction ? "Production" : "Development",
    timestamp: new Date().toISOString(),
  });
});

// GET: Get list of file objects (metadata only)
app.get("/api/files", async (req: Request, res: Response) => {
  const files = await DbService.getAllFiles();
  
  if (!files) {
    return res.status(200).json([]);
  }

  // OPTIMIZATION: Map over files and remove 'fileBody'
  // This reduces the response size from MBs to KBs
  const sanitizedFiles = files.map((file: FileDto) => {
    const { fileBody, ...metadata } = file;
    return metadata;
  });

  res.status(200).json(sanitizedFiles);
});

// GET: Get specific file object by filename (includes fileBody)
app.get("/api/files/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).json({ error: "No filename provided" });
  }
  const fullPath = path.join(UPLOADS_DIR, filename);

  // Security: Prevent accessing files outside the folder (Directory Traversal)
  if (filename.includes("/") || filename.includes("\\")) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  // Control that the file exists physically on disk
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "File not found on disk" });
  }

  // Send file, letting the browser decide how to handle it (whether to download or display it)
  res.status(200).sendFile(fullPath);
});

// PUT: Upload or replace a file
app.put("/api/files/:filename", async (req: Request, res: Response) => {
  const { filename } = req.params;
  const fileDto: FileDto = req.body;

  // 1. Validate URL parameter
  if (!filename) {
    return res.status(400).json({ error: "No filename provided" });
  }

  if (filename.includes("/") || filename.includes("\\")) {
    return res.status(400).json({ error: "Folders are not allowed" });
  }

  // 2. INHERITANCE: Force the DTO to use the URL's filename
  // This ensures they are always identical.
  fileDto.fileName = filename;

  // 3. Validate the rest of the DTO
  // We don't need to check fileDto.fileName anymore because we just set it above.
  if (!fileDto.fileBody || !fileDto.ownerName) {
    return res
      .status(400)
      .json({ error: "Invalid file data: missing fileBody or ownerName" });
  }

  const fullPath = path.join(UPLOADS_DIR, filename);

  try {
    const fileBuffer = Buffer.from(fileDto.fileBody, "base64");

    await fs.promises.writeFile(fullPath, fileBuffer);

    const fileToSave: FileDto = {
      fileName: filename, // Explicitly use the URL filename
      ownerName: fileDto.ownerName,
      uploadedAt: fileDto.uploadedAt || new Date().toISOString(),
      editedAt: new Date().toISOString(),
      sizeInBytes: fileBuffer.length,
      fileBody: fileDto.fileBody,
    };

    await DbService.upsertFile(fileToSave);

    res.status(200).json({
      message: "File saved",
      filename,
      sizeInBytes: fileBuffer.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save file" });
  }
});

// DELETE: Delete a file by filename
app.delete("/api/files/:filename", async (req: Request, res: Response) => {
  const filename = req.params.filename;
  const files = await DbService.getAllFiles();

  if (!files) {
    return res.status(404).json({ error: "File not found!" });
  }

  const index = files.findIndex((file) => file.fileName === filename);

  if (index === -1) {
    return res.status(404).json({ error: "File not found!" });
  }

  files.splice(index, 1);
  await DbService.updateListOfFiles(files);

  if (!filename) {
    return res.status(400).json({ error: "No filename provided" });
  }

  // Delete the physical file
  const fullPath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }

  res.status(200).json(files);
});

//GET: Endpoint for search-bar functionality
app.get("/api/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query || query.trim().length === 0) {
    return res.status(200).json([]);
  }

  const files = await DbService.getAllFiles();

  if (!files || files.length === 0) {
    return res.status(200).json([]);
  }

  //bara resultat med match-score bättre än -1000 (träff närmare 0 = bättre, -1 nästan perfekt, -50 ok, -300 dålig)
  const threshold = query.length < 3 ? -300 : -500;

  //fuzzysort.go params: (searchTerm, list, options) --> returnerar en array av resultatobjekt:
  // {obj: FileDto --> originalobjektet, score: number --> hur bra matchen är, indexes: number [] --> var matchningen sker}
  const results = fuzzysort.go(query, files, {
    keys: ["fileName"],
    threshold,
  });

  const matches = results.map((r) => r.obj);

  res.status(200).json(matches);
});

// --- PRODUCTION ONLY: Catch-all route ---
// For all other routes, serve the Angular app's index.html.
// This supports Angular routing in Prod. In Dev, the proxy handles it.
if (isProduction) {
  app.get("/{*path}", (req: Request, res: Response) => {
    res.sendFile(path.join(ANGULAR_DIST_PATH, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[server]: Backend API running on http://localhost:${PORT}`);
  console.log(
    `[server]: Environment mode: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`
  );
  if (isProduction) {
    console.log(`[server]: Serving Angular app from ${ANGULAR_DIST_PATH}`);
  } else {
    console.log(
      `[server]: Waiting for frontend requests via proxy (ng serve)...`
    );
  }
});
