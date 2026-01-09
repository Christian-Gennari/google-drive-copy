import express from "express";
// Use 'import type' for TypeScript interfaces/types when verbatimModuleSyntax is on
import type { Request, Response, Application } from "express";
import cors from "cors";
import "dotenv/config";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Node.js + TypeScript Server is running!",
    context: "verbatimModuleSyntax is now satisfied",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
