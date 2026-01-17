import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { IconsComponent } from '../icons/icons.component';
import { DatePipe } from '@angular/common';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { FileIconPipe } from '../../pipes/file-icon.pipe';
import { FileHandlingService } from '../../services/file-handling.service';

@Component({
  selector: 'app-filerow',
  imports: [IconsComponent, DatePipe, FileSizePipe, FileIconPipe],
  template: `
    <article class="file-row" (click)="preview.emit()">
      <div class="file-info">
        <div class="file-icon">
          <app-icon [name]="fileName() | fileIcon"></app-icon>
        </div>
        <div class="file-details">
          <span class="file-name">{{ fileName() }}</span>
        </div>
      </div>

      <span class="file-owner">{{ ownerName() }}</span>

      <span class="file-date" id="uploadedAt">
        {{ uploadedAt() | date: (isMobile() ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm') }}
      </span>

      <span class="file-date">
        {{ editedAt() | date: (isMobile() ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm') }}
      </span>

      <span class="file-size">{{ sizeInBytes() ?? 0 | fileSizePipe }}</span>

      <button class="action-button" (click)="onDownloadClick($event)">
        <app-icon [name]="'download'"></app-icon>
      </button>

      <button class="action-button" (click)="onDeleteClick($event)">
        <app-icon [name]="'bin'"></app-icon>
      </button>
    </article>
  `,
  styleUrl: './filerow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilerowComponent {
  private fileService = inject(FileHandlingService);

  // Inputs
  fileName = input.required<string>(); // Use .required for safety if on Angular 17.3+
  ownerName = input<string>('');
  uploadedAt = input<string | undefined>('');
  editedAt = input<string | undefined>('');
  sizeInBytes = input<number | undefined>(0);

  // Output: New Modern Event Emitter
  preview = output<void>();

  onDownloadClick(event: Event) {
    event.stopPropagation(); // Prevents the modal from opening
    this.fileService.downloadFile(this.fileName());
  }

  async onDeleteClick(event: Event) {
    event.stopPropagation(); // Prevents the modal from opening
    await this.fileService.deleteFile(this.fileName());
  }

  isMobile = computed(() => window.innerWidth < 1400);
}
