import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DbService {
  private static filePath = path.join(__dirname, "..", "db.json");

  static async getAllFiles(): Promise<any[] | null> {
    const data = await fs.promises.readFile(this.filePath, "utf-8");
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  static async getFileById(id: number): Promise<any | null> {
    const files = await this.getAllFiles();
    if (!files) {
      return null;
    }
    const file = files.find((f) => f.id === id);
    return file;
  }
}
