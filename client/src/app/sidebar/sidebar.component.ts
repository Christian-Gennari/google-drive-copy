import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { NavButtonComponent } from '../components/nav-button/nav-button.component';
import { FileHandlingService } from '../services/file-handling.service';
import { FileSizePipe } from '../pipes/file-size.pipe';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-sidebar',
  imports: [NavButtonComponent, FileSizePipe],
  template: `
    <nav>
      <app-nav-button
        label="Nytt"
        icon="plus"
        variant="primary"
        class="new-button"
        (click)="addNewFile()"
      />
      @for (item of navItems; track item.label) {
        <app-nav-button [label]="item.label" [icon]="item.icon" [class]="item.class" />
      }
    </nav>
    <div class="storage-bar">
      <div class="storage-fill" [style.width.%]="storagePercentage()"></div>
    </div>
    <p>{{ fileService.usedStorageInBytes() | fileSizePipe }} av 15 GB används</p>
    <app-nav-button label="Få mer lagringsutrymme" variant="secondary" class="get-storage" />
  `,
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  fileService = inject(FileHandlingService);
  toastService = inject(ToastService);

  storagePercentage = computed(() => {
    const maxStorageInBytes = 15 * 1024 * 1024 * 1024;
    const usedBytes = this.fileService.usedStorageInBytes();
    return Math.min((usedBytes / maxStorageInBytes) * 100, 100);
  });

  addNewFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) {
        this.toastService.show('Ingen fil valdes.', 'error');
        return;
      }

      const fileToReturn: File = target.files[0];
      this.fileService.uploadFile(fileToReturn);
      document.body.removeChild(input);
    });

    document.body.appendChild(input);
    input.click();
  }

  protected readonly navItems = [
    { label: 'Startsida', class: 'home-page', icon: 'home' },
    { label: 'Min enhet', class: 'my-unit', icon: 'my-unit' },
    { label: 'Datorer', class: 'computers', icon: 'computer' },
    { label: 'Delas med mig', class: 'shared-with-me', icon: 'shared-with-me' },
    { label: 'Senaste', class: 'latest', icon: 'latest' },
    { label: 'Stjärnmärkt', class: 'marked', icon: 'marked' },
    { label: 'Skräppost', class: 'trash', icon: 'trash' },
    { label: 'Papperskorg', class: 'bin', icon: 'bin' },
    { label: 'Lagring', class: 'storage', icon: 'storage' },
  ];
}
