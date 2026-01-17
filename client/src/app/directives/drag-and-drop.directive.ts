import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
  standalone: true,
})
export class DragAndDropDirective {

  fileDropped = output<File>();
  dragEnter = output<void>();
  dragLeave = output<void>();

  // Counter to handle child-element flickering issues
  private dragCounter = 0;

  @HostListener('window:dragenter', ['$event'])
  onWindowDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragCounter++;

    // Emit only when we first enter the window context
    if (this.dragCounter === 1) {
      this.dragEnter.emit();
    }
  }

  @HostListener('window:dragleave', ['$event'])
  onWindowDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragCounter--;

    // Emit only when we have truly left the window
    if (this.dragCounter === 0) {
      this.dragLeave.emit();
    }
  }

  @HostListener('window:dragover', ['$event'])
  onWindowDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('window:drop', ['$event'])
  onWindowDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Reset
    this.dragCounter = 0;
    this.dragLeave.emit();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileDropped.emit(files[0]);
    }
  }
}
