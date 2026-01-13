import express from "express";
import type { Request, Response, Application } from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";
import { DbService } from "./db.service.js";
import type { FileDto } from "../../shared/file-metadata.dto.js";

const app: Application = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

// FIX: Removed express.raw. We use JSON because we are sending a DTO.
// Increased limit to 100mb to handle large Base64 strings.
app.use(express.json({ limit: "100mb" }));

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    message: "API ok",
    timestamp: new Date().toISOString(),
  });
});

// GET: Get list of file metadata
app.get("/api/files", async (req: Request, res: Response) => {
  const files = await DbService.getAllFiles();
  // Return empty array if no files found, which is safer for frontend
  if (!files) {
    return res.status(200).json([]);
  }
  res.status(200).json(files);
});

// GET: Get specific file metadata by ID
app.get("/api/files/:id", async (req: Request, res: Response) => {
  const fileId = req.params.id;
  const file = await DbService.getFileById(Number(fileId));

  if (!file) {
    return res.status(404).json({ error: "File not found!" });
  }

  res.status(200).json(file);
});

// PUT: Upload or update a file
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

// Changed from :id to :filename to match the rest of our logic
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
  await DbService.UpdateListOfFiles(files);

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

app.listen(PORT, () => {
  console.log(`[server]: Backend API running on http://localhost:${PORT}`);
});
