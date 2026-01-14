import { Component, EventEmitter, inject, input, output } from '@angular/core';
import { FileHandlingService } from '../services/file-handling.service';

@Component({
  selector: 'app-new-content',
  imports: [],
  template: ` @if (open()) {
    <select name="new-content" class="new-content" (change)="onSelectChange($event)">
      <option value="folder">Ladda upp ny mapp</option>
      <option value="file">Ladda upp ny fil</option>
    </select>
    }`,
  styleUrls: ['./new-content.component.scss'],
})
export class NewContentComponent {
  FileService = inject(FileHandlingService);

  open = input<boolean>(false);
  close = output<void>();

  onSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    if (value === 'file') {
      const input = document.createElement('input'); // This createElement use is approved by Oscar!
      input.type = 'file';
      input.style.display = 'none';

      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) {
          alert('Fil kunde inte laddas upp');
          return;
        }

        const fileToReturn: File = target.files[0];
        this.FileService.onFileSelected(fileToReturn);
        document.body.removeChild(input);

        // Close the dropdown after file selection
        this.close.emit();
      });

      document.body.appendChild(input);
      input.click();

      // Reset select to default
      select.value = '';
    }
  }
}
