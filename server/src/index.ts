import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import { CONFIG } from "./config.js";
import { fileRouter } from "./file.routes.js";

const app: Application = express();
const PORT = CONFIG.port;

const isProduction = process.env.NODE_ENV === "production";
const UPLOADS_DIR = CONFIG.paths.uploads;
const ANGULAR_DIST_PATH = CONFIG.paths.angularDist;

// --- 1. BOOTSTRAP CHECKS ---
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
  console.log(`Created uploads directory at: ${UPLOADS_DIR}`);
}

// --- 2. GLOBAL MIDDLEWARE ---
app.use(helmet());
app.use(express.json());

// --- 3. HEALTH CHECK ---
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    message: "API ok",
    mode: isProduction ? "Production" : "Development",
    timestamp: new Date().toISOString(),
  });
});

// --- 4. MOUNT API ROUTES ---
// This tells Express: "For any request starting with /api, use the fileRouter"
app.use("/api", fileRouter);

// --- 5. STATIC FILES (Frontend) ---
if (isProduction) {
  app.use(express.static(ANGULAR_DIST_PATH));
  // Catch-all for Angular routing
  app.get("/{*path}", (req: Request, res: Response) => {
    res.sendFile(path.join(ANGULAR_DIST_PATH, "index.html"));
  });
}

// --- 6. START SERVER ---
app.listen(PORT, () => {
  console.log(`[server]: Backend API running on http://localhost:${PORT}`);
  console.log(
    `[server]: Environment mode: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`,
  );
});
