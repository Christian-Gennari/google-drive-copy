import express from "express";
import type {Request, Response, Application} from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import {fileURLToPath} from "url";
import {DbService} from "./db.service.js";

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

app.use("/api/files",
    express.raw({
        type: "*/*",
        limit: "10mb"
    }))

app.use(express.json());

if(!fs.existsSync(UPLOADS_DIR)){
    fs.mkdirSync(UPLOADS_DIR);
}

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
        return res.status(404).json({error: "File not found!"});
    }
    res.status(200).json(files);
});

// GET: Get specific file metadata by ID
app.get("/api/files/:id", async (req: Request, res: Response) => {
    const fileId = req.params.id;
    const file = await DbService.getFileById(Number(fileId));

    if (!file) {
        return res.status(400).json({error: "File not found!"});
    }

    res.status(200).json(file);
});

app.put("/api/files/:filename", async (req: Request, res: Response) => {
    const {filename} = req.params;

    if (!filename) {
        return res.status(400).json({error: "No filename provided"})
    }

    if (filename.includes("/") || filename.includes("\\")) {
        return res.status(400).json({error: "Folders are not allowed"});
    }

    const fullPath = path.join(UPLOADS_DIR, filename);

    try {
        await fs.promises.writeFile(fullPath, req.body);

        await DbService.upsertFile({
            fileName: filename,
            ownerName: req.body.ownerName,
            uploadedAt: new Date().toISOString(),
            editedAt: new Date().toISOString(),
            sizeInBytes: req.body.length,
            fileBody: req.body
        });

        res.status(200).json({
            message: "File saved",
            filename,
            size: req.body.length
        });
    } catch {
        res.status(500).json({error: "Failed to save file"});
    }
});
app.delete("/api/files/:id", async (req: Request, res: Response) => {
    const fileId = Number(req.params.id);
    const files = await DbService.getAllFiles();

    if (!files) {
        return res.status(400).json({error: "File not found!"});
    }

    const index = files.findIndex(file => file.id === fileId);

    if (index === -1) {
        return res.status(404).json({error: "File not found!"});
    }

    files.splice(index, 1);
    await DbService.UpdateListOfFiles(files);

    res.status(200).json(files);

});

app.listen(PORT, () => {
    console.log(`[server]: Backend API running on http://localhost:${PORT}`);
});
