import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FileDto } from '../../../../shared/file.dto';

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  private http = inject(HttpClient);

  // GET FILES (Supports optional search query)
  async fetchFiles(query?: string): Promise<FileDto[]> {
    const url = query ? `/api/search?q=${encodeURIComponent(query)}` : '/api/files';
    return await firstValueFrom(this.http.get<FileDto[]>(url));
  }

  // UPLOAD
  async upload(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ownerName', 'Kalle Anka'); // Hardcoded owner for now

    // We expect the server to return JSON, but we don't strictly need the content here
    await firstValueFrom(this.http.post('/api/files', formData));
  }

  // DELETE
  async delete(filename: string): Promise<void> {
    await firstValueFrom(this.http.delete(`/api/files/${filename}`));
  }

  // DOWNLOAD (Helper to trigger browser download)
  download(filename: string): void {
    const url = `/api/files/${filename}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
