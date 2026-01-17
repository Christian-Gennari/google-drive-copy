import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FileDto } from '../../../../../shared/file.dto';

@Component({
  selector: 'app-preview-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ file()?.fileName }}</h3>
          <button class="close-btn" (click)="close.emit()">✕</button>
        </div>

        <div class="modal-body">
          @if (isImage()) {
            <img [src]="fileUrl()" alt="Preview" />
          } @else if (isVideo()) {
            <video [src]="fileUrl()" controls autoplay></video>
          } @else if (isPdf()) {
            <iframe [src]="safeFileUrl()" type="application/pdf"></iframe>
          } @else {
            <div class="no-preview">
              <span class="icon">📄</span>
              <p>Förhandsgranskning saknas.</p>
              <a [href]="fileUrl()" download class="download-btn">Ladda ner filen</a>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        /* Keep the backdrop dark/transparent regardless of theme for focus */
        background: rgba(0, 0, 0, 0.85);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease-out;
      }

      .modal-content {
        /* Use global panel background (Light: #f8f8f8, Dark: #1b1b1b) */
        background: var(--color-panels-bg);
        color: var(--color-text);
        border-radius: 8px;
        width: 90vw;
        height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-elev-1);
      }

      .modal-header {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--color-border-subtle);

        h3 {
          margin: 0;
          font-weight: 500;
          font-size: 16px;
          color: var(--color-text);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 24px;
          cursor: pointer;
          padding: 4px 8px;
          transition: color 0.2s;

          &:hover {
            color: var(--color-text);
          }
        }
      }

      .modal-body {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        /* Use main app background (Light: #fefeff, Dark: #121212) */
        background: var(--color-main-bg);
        padding: 16px;
        overflow: auto;

        img,
        video {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: white; /* PDFs usually look best on white paper background */
        }

        .no-preview {
          text-align: center;
          color: var(--color-text-muted);

          .icon {
            font-size: 48px;
            display: block;
            margin-bottom: 16px;
          }

          .download-btn {
            display: inline-block;
            margin-top: 16px;
            padding: 8px 16px;
            background: var(--color-primary);
            color: #fff; /* Always white text on primary button */
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;

            &:hover {
              opacity: 0.9;
            }
          }
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class PreviewModalComponent {
  private sanitizer = inject(DomSanitizer);

  file = input<FileDto | null>(null);
  close = output<void>();

  fileUrl = computed(() => {
    const f = this.file();
    return f ? `/api/files/${f.fileName}` : '';
  });

  safeFileUrl = computed(() => {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl());
  });

  extension = computed(() => this.file()?.fileName.split('.').pop()?.toLowerCase() ?? '');

  isImage = computed(() => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(this.extension()));
  isVideo = computed(() => ['mp4', 'webm', 'ogg'].includes(this.extension()));
  isPdf = computed(() => ['pdf'].includes(this.extension()));
}
