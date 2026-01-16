import { Component, inject, input } from '@angular/core';
import { FilerowComponent } from '../components/filerow/filerow.component';
import { FileHandlingService } from '../services/file-handling.service';
import { DragAndDropDirective } from '../directives/drag-and-drop.directive';

@Component({
  selector: 'app-mainview',
  imports: [FilerowComponent, DragAndDropDirective],
  template: `
    <div class="mainview" appDragAndDrop (fileDropped)="onFileDropped($event)" ()="" ) >
        @if (FileService.filesList().length > 0) {
          <div class="file-list-header">
            <span class="header-name">Namn</span>
            <span class="header-owner">Ägare</span>
            <span class="header-date" id="headerUploadedAt">Uppladdad</span>
            <span class="header-date">Ändrad</span>
            <span class="header-size">Storlek</span>
            <span class="header-action"></span>
          </div>
          <div class="file-list">
            @for (filerow of FileService.filesList(); track filerow.fileName) {
              <app-filerow
                [fileName]="filerow.fileName"
                [ownerName]="filerow.ownerName"
                [uploadedAt]="filerow.uploadedAt"
                [editedAt]="filerow.editedAt"
                [sizeInBytes]="filerow.sizeInBytes"
              ></app-filerow>
            }
          </div>
        } @else {
          <div class="empty-state">
            <img [src]="randomEmptyStateImage" alt="Inga filer" />
            <p>Ooops... Inga filer att visa!</p>
          </div>
        }
      </div>
  `,
  styleUrl: './mainview.component.scss',
})
export class MainviewComponent {
  FileService = inject(FileHandlingService);

  fileReceived = input<File>();

  onFileDropped(fileReceived : File) : void {
    // stäng modal
    this.FileService.uploadFile(fileReceived);
  }

  private emptyStateImages = [
    'assets/empty-state-1.png',
    'assets/empty-state-2.png',
    'assets/empty-state-3.png',
  ];

  randomEmptyStateImage = this.emptyStateImages[
    Math.floor(Math.random() * this.emptyStateImages.length)
  ];
}
