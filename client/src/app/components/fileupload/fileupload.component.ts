import {Component, inject} from '@angular/core';
import {FileHandlingService} from '../../services/file-handling.service';

@Component({
  selector: 'app-fileupload',
  imports: [],
  template: `
  <input type="file" id="myFile" (change)="onFileSelected($event)" name="myFile">
  `,

  styleUrls: ['./fileupload.component.scss'],
})
export class FileuploadComponent {

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const fileHandlingServiceInjection = inject(FileHandlingService);
    fileHandlingServiceInjection.content.set(file);
    console.log(file);
  }
}
