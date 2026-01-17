import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  text: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast = signal<ToastMessage | null>(null);

  show(text: string, type: ToastType = 'success') {
    this.toast.set({ text, type });
    // Hide automatically after 3 seconds
    setTimeout(() => this.toast.set(null), 3000);
  }
}
