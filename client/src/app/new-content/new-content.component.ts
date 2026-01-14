import { Component, inject } from '@angular/core';
import { FileHandlingService } from '../services/file-handling.service';

@Component({
  selector: 'app-new-content',
  imports: [],
  template: ` <div>
    <select name="new-content" class="new-content" (change)="onSelectChange($event)">
      <option value="folder">Ladda upp ny mapp</option>
      <option value="file">Ladda upp ny fil</option>
    </select>
  </div>`,
  styleUrls: ['./new-content.component.scss'],
})
export class NewContentComponent {
  FileService = inject(FileHandlingService);

  /*
  1. vi hämtar att det är en "fil" från select
  2. vi skapar en input som inte syns och där vi kan ladda upp filen från datorn
  3. vi sparar filen här, lokalt
  (4. vi skickar filen till service som uppdaterar selectedFile)
  5. anropa (härifrån) att vi vill ladda upp filen 
   */


  private newFile = File; 

  onSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    
    if (value === "file") {
      const input = document.createElement('input'); // This createElement use is approved by Oscar!
      input.type = 'file';
      input.style.display = 'none';
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);

      if (!input.files || input.files.length === 0 ) {
        alert("Fil kunde inte laddas upp");
        return;
      }

      const fileToReturn: File = input.files[0];
      this.FileService.onFileSelected(fileToReturn);
    }



  }


  onClick(): void {

  }
}
