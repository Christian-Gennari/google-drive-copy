import { computed, Injectable, signal } from '@angular/core';
import { FileDto } from '../../../../shared/file.dto';

@Injectable({
  providedIn: 'root',
})
export class FileHandlingService {
  // SIGNALS
  selectedFile = signal<File | null>(null);
  filesList = signal<FileDto[]>([]);
  allFiles = signal<FileDto[]>([]);

  usedStorageInBytes = computed(() => {
    return this.allFiles()
      .map((file) => file.sizeInBytes)
      .reduce((totalBytes: number, currentFileSize) => totalBytes + (currentFileSize ?? 0), 0);
  });

  // Handles file selection from an input element
  onFileSelected(file: File) {
    this.selectedFile.set(file);
    this.uploadFile(file).then((r) => console.log(r));
    console.log(file);
  }

  // ========================
  // CONVERSION METHODS
  // ========================

  convertFileToBase64(selectedFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile); // Read file and automatically encode as base64
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  }

  // Converts from File to FileDto format
  async convertToFileDto(file: File): Promise<FileDto> {
    const base64 = await this.convertFileToBase64(file);

    return {
      fileName: file.name,
      ownerName: 'Kalle Anka',
      fileBody: base64,
    };
  }

  // ========================
  // API CALLS
  // ========================

  // PUT: Upload or replace a file
  async uploadFile(file: File) {
    const fileDto = await this.convertToFileDto(file);

    const response = await fetch(`/api/files/${file.name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileDto),
    });

    // Refresh the files list after successful upload
    if (response.ok) {
      await this.fetchAllFiles();
    }

    return response;
  }

  // GET: Retrieve all files
  async fetchAllFiles(): Promise<FileDto[]> {
    const response = await fetch('/api/files', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const filesData = (await response.json()) as FileDto[];
    this.filesList.set(filesData);
    this.allFiles.set(filesData);
    console.log('Fetched files:', filesData);
    return filesData;
  }

  downloadFile(filename: string): void {
    const url = `/api/files/${filename}`;

    // Create a temporary anchor element to trigger download (browser-compatible, ugly but works)
    const link = document.createElement('a'); // This createElement use is approved by Oscar!
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // GET for SEARCH-results
  async searchAllFiles(query: string): Promise<FileDto[]> {
    if (!query || query.trim().length === 0) {
      return this.fetchAllFiles();
    }

    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
      //TODO: lägga in en länk till den "tomma" sidan?
    }

    const results = (await response.json()) as FileDto[];
    this.filesList.set(results);
    return results;
  }

  // DELETE: file by filename
  async deleteFile(filename: string): Promise<boolean> {
    const response = await fetch(`/api/files/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Update the local signal by filtering out the deleted file
      this.filesList.update((files) => files.filter((f) => f.fileName !== filename));
      this.allFiles.update((files) => files.filter((f) => f.fileName !== filename));
      return true;
    }

    return false;
  }
}
