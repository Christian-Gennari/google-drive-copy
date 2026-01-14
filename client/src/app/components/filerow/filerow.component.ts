import { Component, input } from '@angular/core';
import { IconsComponent } from '../icons/icons.component';

@Component({
  selector: 'app-filerow',
  imports: [IconsComponent],
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
      <span class="file-date">{{ uploadedAt() || '-' }}</span>
      <span class="file-date">{{ editedAt() || '-' }}</span>
      <span class="file-size">{{ sizeInBytes() }}</span>
      <button class="action-button">
        <app-icon [name]="'download'"></app-icon>
      </button>
    </article>
  `,
  styleUrl: './filerow.component.scss',
})
export class FilerowComponent {
  fileName = input<string>('');
  ownerName = input<string>('');
  uploadedAt = input<string | undefined>('');
  editedAt = input<string | undefined>('');
  sizeInBytes = input<number | undefined>(0);
}
