import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { IconsComponent } from '../icons/icons.component';
import { DatePipe } from '@angular/common';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { FileHandlingService } from '../../services/file-handling.service';

@Component({
  selector: 'app-filerow',
  imports: [IconsComponent, DatePipe, FileSizePipe],
  template: `
    <article class="file-row">
      <div class="file-info">
        <div class="file-icon">
          <app-icon [name]="'document'"></app-icon>
        </div>
        <div class="file-details">
          <span class="file-name">{{ fileName() }}</span>
        </div>
      </div>
      <span class="file-owner">{{ ownerName() }}</span>
      <span class="file-date">{{ uploadedAt() | date : 'yyyy-MM-dd HH:mm' }}</span>
      <span class="file-date">{{ editedAt() | date : 'yyyy-MM-dd HH:mm' }}</span>
      <span class="file-size">{{ sizeInBytes() ?? 0 | fileSizePipe }}</span>
      <button class="action-button" (click)="onDownloadClick()">
        <app-icon [name]="'download'"></app-icon>
      </button>
      <button class="action-button" (click)="onDeleteClick()">
        <app-icon [name]="'bin'"></app-icon>
      </button>
    </article>
  `,
  styleUrl: './filerow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilerowComponent {
  private fileService = inject(FileHandlingService);

  fileName = input<string>('');
  ownerName = input<string>('');
  uploadedAt = input<string | undefined>('');
  editedAt = input<string | undefined>('');
  sizeInBytes = input<number | undefined>(0);

  onDownloadClick() {
    this.fileService.downloadFile(this.fileName());
  }

  protected async onDeleteClick() {
    await this.fileService.deleteFile(this.fileName());
  }
}
