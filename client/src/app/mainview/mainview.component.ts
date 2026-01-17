import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { FilerowComponent } from '../components/filerow/filerow.component';
import { FileHandlingService } from '../services/file-handling.service';
import { DragAndDropDirective } from '../directives/drag-and-drop.directive';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DragOverlayComponent } from '../components/drag-overlay/drag-overlay.component';

@Component({
  selector: 'app-mainview',
  imports: [FilerowComponent, DragAndDropDirective],
  template: `
    <div
      class="mainview"
      appDragAndDrop
      (fileDropped)="onFileDropped($event)"
      (dragEnter)="onDragEnter()"
      (dragLeave)="onDragLeave()"
    >
      @if (FileService.filesResource.value(); as files) {
        @if (showSpinner()) {
          <div class="spinner-overlay">
            <div class="spinner"></div>
          </div>
        }

        @if (files.length > 0) {
          <div class="file-list-header">
            <span class="header-name">Namn</span>
            <span class="header-owner">Ägare</span>
            <span class="header-date" id="headerUploadedAt">Uppladdad</span>
            <span class="header-date">Ändrad</span>
            <span class="header-size">Storlek</span>
            <span class="header-action"></span>
          </div>

          <div class="file-list" [class.is-reloading]="FileService.filesResource.isLoading()">
            @for (filerow of files; track filerow.fileName) {
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
      } @else if (FileService.filesResource.isLoading()) {
        @if (showSpinner()) {
          <div class="state-container">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: var(--color-text-muted);">Laddar filer...</p>
          </div>
        }
      } @else if (FileService.filesResource.error()) {
        <div class="state-container error">
          <p>⚠️ Kunde inte ladda filer. Är servern igång?</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./mainview.component.scss'],
})
export class MainviewComponent implements OnDestroy {
  FileService = inject(FileHandlingService);
  private overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  // UX: Track if the loading is taking "too long" (e.g. > 800ms)
  showSpinner = signal(false);

  constructor() {
    // EFFECT: Debounce the spinner
    effect((onCleanup) => {
      // 1. Check if resource is currently loading
      if (this.FileService.filesResource.isLoading()) {
        // 2. Start a timer. If loading finishes before 800ms, this never fires.
        const timer = setTimeout(() => {
          this.showSpinner.set(true);
        }, 800);

        // 3. Cleanup runs if 'isLoading' changes (e.g. back to false)
        onCleanup(() => {
          clearTimeout(timer);
          this.showSpinner.set(false); // Hide immediately when done
        });
      } else {
        // Ensure it's hidden if not loading
        this.showSpinner.set(false);
      }
    });
  }

  // --- Drag & Drop Logic ---
  onDragEnter(): void {
    if (this.overlayRef) return;

    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'drag-overlay-backdrop',
      panelClass: 'drag-overlay-panel',
    });

    const portal = new ComponentPortal(DragOverlayComponent);
    this.overlayRef.attach(portal);
  }

  onDragLeave(): void {
    this.closeOverlay();
  }

  onFileDropped(fileReceived: File): void {
    this.closeOverlay();
    this.FileService.uploadFile(fileReceived);
  }

  private closeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  ngOnDestroy(): void {
    this.closeOverlay();
  }

  private emptyStateImages = [
    'assets/empty-state-1.png',
    'assets/empty-state-2.png',
    'assets/empty-state-3.png',
  ];

  randomEmptyStateImage =
    this.emptyStateImages[Math.floor(Math.random() * this.emptyStateImages.length)];
}
