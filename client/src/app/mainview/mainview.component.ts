import { Component, inject } from '@angular/core';
import { FilerowComponent } from '../components/filerow/filerow.component';
import { FileHandlingService } from '../services/file-handling.service';

@Component({
  selector: 'app-mainview',
  imports: [FilerowComponent],
  template: `
    <div class="mainview">
      @for (filerow of FileService.filesList(); track FileService.filesList.name) {
      <app-filerow
        [fileName]="filerow.fileName"
        [ownerName]="filerow.ownerName"
        [uploadedAt]="filerow.uploadedAt"
        [editedAt]="filerow.editedAt"
        [sizeInBytes]="filerow.sizeInBytes"
      ></app-filerow>
      }
    </div>
  `,
  styleUrl: './mainview.component.scss',
})
export class MainviewComponent {
  FileService = inject(FileHandlingService);
}
