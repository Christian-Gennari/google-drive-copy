import express from "express";
import type { Request, Response, Application } from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";
import { DbService } from "./db.service.js";

const app: Application = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    message: "API ok",
    timestamp: new Date().toISOString(),
  });
});

// Add more API-endpoints here
app.get("/api/data", (req: Request, res: Response) => {
  res.json({
    items: ["Item 1", "Item 2", "Item 3"],
  });
});

// GET: Get list of file metadata
app.get("/api/files", async (req: Request, res: Response) => {
  const files = await DbService.getAllFiles();
  if (!files) {
    return res.status(404).json({ error: "File not found!" });
  }
  res.status(200).json(files);
});

// GET: Get specific file metadata by ID
app.get("/api/files/:id", async (req: Request, res: Response) => {
  const fileId = req.params.id;
  const file = await DbService.getFileById(Number(fileId));

  if (!file) {
    return res.status(400).json({ error: "File not found!" });
  }

  res.status(200).json(file);
});

app.listen(PORT, () => {
  console.log(`[server]: Backend API running on http://localhost:${PORT}`);
});
