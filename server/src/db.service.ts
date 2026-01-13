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

  static async UpdateListOfFiles(list : JSON[]): Promise<void> {
    const newList = JSON.stringify(list, null, 4);
    await fs.promises.writeFile(this.filePath, newList, 'utf-8');
  }

  static async upsertFile(fileData: any): Promise<void> {
    const files = await this.getAllFiles() || [];
    const existingFileIndex = files.findIndex(f => f.fileName === fileData.fileName);

    if (existingFileIndex !== -1) {
      files[existingFileIndex] = {
        fileName: fileData.fileName,
        ownerName: fileData.ownerName,
        uploadedAt: files[existingFileIndex].uploadedAt,
        editedAt: fileData.editedAt,
        sizeInBytes: fileData.sizeInBytes,
        body: fileData.fileBody
      }
    } else {
      files.push(fileData);
    }

    await this.UpdateListOfFiles(files);
  }
}
