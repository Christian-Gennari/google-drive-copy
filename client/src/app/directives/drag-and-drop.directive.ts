import { Directive, HostListener, signal, output } from '@angular/core';
import { DragOverlayComponent } from '../components/drag-overlay/drag-overlay.component';

@Directive({
  selector: '[appDragAndDrop]',
})
export class DragAndDropDirective {

  fileDropped = output<File>();

  @HostListener('dragover', ['$event'])
  handleOnDragover(event: DragEvent): void {
    event.preventDefault();
    console.log('nu drar jag över');
  }

  @HostListener('dragleave', ['$event'])
  handleLeave(event: DragEvent): void {
    event.preventDefault();
    console.log('nu drar jag iväg');
  }

  @HostListener('drop', ['$event'])
  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    console.log('nu släpper jag');
    if (file) {
      this.fileDropped.emit(file);
    }
  }
}
