import { Component, input } from '@angular/core';

@Component({
  selector: 'app-filerow',
  imports: [],
  template: `
    <article class="file-row">
      <span>{{ fileName() }}</span>
      <span>{{ ownerName() }}</span>
      <span>{{ uploadedAt() }}</span>
      <span>{{ editedAt() }}</span>
      <span>{{ sizeInBytes() }} bytes</span>
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
