import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { FileApiService } from './file-api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class FileHandlingService {
  private api = inject(FileApiService);
  private toast = inject(ToastService);

  // 1. SIGNAL: Search State
  searchQuery = signal<string>('');

  // 2. VIEW RESOURCE: The List Users See
  filesResource = resource({
    loader: async () => {
      // Logic: Ask the API for data based on our signal
      return await this.api.fetchFiles(this.searchQuery());
    },
  });

  // 3. STORAGE RESOURCE: The Stats Data
  storageResource = resource({
    loader: async () => {
      // Logic: Ask the API for *all* files (no query)
      return await this.api.fetchFiles();
    },
  });

  // 4. COMPUTED: Stats Logic
  usedStorageInBytes = computed(() => {
    const files = this.storageResource.value() ?? [];
    return files.map((f) => f.sizeInBytes ?? 0).reduce((acc, curr) => acc + curr, 0);
  });

  // 5. UI STATE
  isUploading = signal(false);

  // --- ACTIONS ---

  searchAllFiles(query: string) {
    this.searchQuery.set(query);
    this.filesResource.reload();
  }

  async uploadFile(file: File) {
    this.isUploading.set(true);
    try {
      await this.api.upload(file); // Delegate to API

      // Update State
      this.filesResource.reload();
      this.storageResource.reload();
      this.toast.show(`Filen "${file.name}" laddades upp!`, 'success');
    } catch (error) {
      console.error('Upload error', error);
      this.toast.show('Kunde inte ladda upp filen.', 'error');
    } finally {
      this.isUploading.set(false);
    }
  }

  async deleteFile(filename: string) {
    try {
      await this.api.delete(filename); // Delegate to API

      // Update State
      this.filesResource.reload();
      this.storageResource.reload();
      this.toast.show('Filen raderades.', 'success');
      return true;
    } catch (error) {
      console.error('Delete error', error);
      this.toast.show('Kunde inte radera filen.', 'error');
      return false;
    }
  }

  downloadFile(filename: string) {
    this.api.download(filename);
  }
}
