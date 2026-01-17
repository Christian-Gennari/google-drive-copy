import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDto } from '../../../../../shared/file.dto';

@Component({
  selector: 'app-preview-modal',
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
            <iframe [src]="fileUrl()" type="application/pdf"></iframe>
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
        background: rgba(0, 0, 0, 0.85);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease-out;
      }

      .modal-content {
        background: #1e1e1e;
        color: white;
        border-radius: 8px;
        width: 90vw;
        height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }

      .modal-header {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #333;

        h3 {
          margin: 0;
          font-weight: 500;
          font-size: 16px;
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 4px 8px;
        }
      }

      .modal-body {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
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
          background: white;
        }

        .no-preview {
          text-align: center;
          .icon {
            font-size: 48px;
            display: block;
            margin-bottom: 16px;
          }
          .download-btn {
            display: inline-block;
            margin-top: 16px;
            padding: 8px 16px;
            background: #4285f4;
            color: white;
            text-decoration: none;
            border-radius: 4px;
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
  file = input<FileDto | null>(null);

  close = output<void>();

  fileUrl = computed(() => {
    const f = this.file();
    return f ? `/api/files/${f.fileName}` : '';
  });

  extension = computed(() => this.file()?.fileName.split('.').pop()?.toLowerCase() ?? '');

  isImage = computed(() => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(this.extension()));
  isVideo = computed(() => ['mp4', 'webm', 'ogg'].includes(this.extension()));
  isPdf = computed(() => ['pdf'].includes(this.extension()));
}
