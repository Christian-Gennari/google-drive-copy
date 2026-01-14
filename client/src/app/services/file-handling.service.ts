import { Injectable, signal } from '@angular/core';
import { FileDto } from '../../../../shared/file-metadata.dto';

@Injectable({
  providedIn: 'root',
})
export class FileHandlingService {
  // SIGNALS
  selectedFile = signal<File | null>(null);
  filesList = signal<FileDto[]>([]);

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

  convertBase64ToFile(base64: string, fileName: string): File {
    // Decode base64 string to get the original binary data
    const binaryString = atob(base64);
    // Convert each character to its byte value (0-255)
    const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    // Create a File object from the byte data
    return new File([bytes], fileName);
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
    console.log('Fetched files:', filesData);
    return filesData;
  }


  // GET for SEARCH-results
  async searchAllFiles(query: string): Promise<FileDto[]> {
    if (!query || query.trim().length === 0) {
      return this.fetchAllFiles();
    }

    const response = await fetch (`/api/search?q=${encodeURIComponent(query)}`, {
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
  };

}
