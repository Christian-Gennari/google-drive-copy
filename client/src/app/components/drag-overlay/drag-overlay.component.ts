import { Component } from '@angular/core';

@Component({
  selector: 'app-drag-overlay',
  template: `
    <div class="drag-overlay-content">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <p>Släpp filen för att ladda upp</p>
    </div>
  `,
  styleUrls: ['./drag-overlay.component.scss'],
})
export class DragOverlayComponent {}
