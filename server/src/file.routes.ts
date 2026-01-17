import { Router, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import fuzzysort from "fuzzysort";
import { DbService } from "./db.service.js";
import { CONFIG } from "./config.js";
import type { FileDto } from "../../shared/file.dto.js";

// Create a new Router instance
export const fileRouter = Router();

const UPLOADS_DIR = CONFIG.paths.uploads;

// --- 1. SETUP MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// --- 2. SETUP VALIDATION ---
const UploadSchema = z.object({
  ownerName: z
    .string()
    .min(1, "Owner name is required")
    .max(50, "Name too long"),
});

// --- 3. DEFINE ROUTES ---

// GET All Files
fileRouter.get("/files", async (req: Request, res: Response) => {
  const files = await DbService.getAllFiles();
  res.json(files || []);
});

// GET Single File (Download)
fileRouter.get("/files/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;
  if (!filename || filename.includes("/") || filename.includes("\\")) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  const fullPath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "File not found on disk" });
  }

  res.sendFile(fullPath);
});

// SEARCH Files
fileRouter.get("/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query || !query.trim()) return res.json([]);

  const files = await DbService.getAllFiles();
  if (!files || files.length === 0) return res.json([]);

  const threshold = query.length < 3 ? -300 : -500;
  const results = fuzzysort.go(query, files, {
    keys: ["fileName"],
    threshold,
  });

  res.json(results.map((r) => r.obj));
});

// POST Upload File
fileRouter.post(
  "/files",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const file = req.file;
    const body = req.body;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const validation = UploadSchema.safeParse(body);

    if (!validation.success) {
      if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({
        error: "Validation failed",
        details: validation.error.format(),
      });
    }

    try {
      const fileToSave: FileDto = {
        fileName: file.filename,
        ownerName: validation.data.ownerName,
        uploadedAt: new Date().toISOString(),
        editedAt: new Date().toISOString(),
        sizeInBytes: file.size,
      };

      await DbService.upsertFile(fileToSave);

      res.json({
        message: "File uploaded successfully",
        filename: file.filename,
        sizeInBytes: file.size,
      });
    } catch (error) {
      console.error("Upload failed", error);
      if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      res.status(500).json({ error: "Failed to save file metadata" });
    }
  },
);

// DELETE File
fileRouter.delete("/files/:filename", async (req: Request, res: Response) => {
  const { filename } = req.params;

  try {
    const files = await DbService.getAllFiles();
    if (!files) return res.status(404).json({ error: "File not found" });

    const index = files.findIndex((f) => f.fileName === filename);
    if (index === -1) return res.status(404).json({ error: "File not found" });

    // Remove from DB
    files.splice(index, 1);
    await DbService.updateListOfFiles(files);

    // Remove from Disk
    const fullPath = path.join(UPLOADS_DIR, filename as string);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    res.json({ message: "File deleted", filename });
  } catch (error) {
    res.status(500).json({ error: "Could not delete file" });
  }
});
