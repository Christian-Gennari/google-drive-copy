import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { NavButtonComponent } from '../components/nav-button/nav-button.component';
import { FileHandlingService } from '../services/file-handling.service';
import { NewContentComponent } from '../new-content/new-content.component';

@Component({
  selector: 'app-sidebar',
  imports: [NavButtonComponent, NewContentComponent],
  template: `
    <nav>
      <app-nav-button
        label="Nytt"
        icon="plus"
        variant="primary"
        class="new-button"
        (click)="onNewButtonClick()"
      />

      <app-new-content [open]="dropdownOpen()" (close)="dropdownOpen.set(false)"></app-new-content>
      @for (item of navItems; track item.label) {
      <app-nav-button [label]="item.label" [icon]="item.icon" [class]="item.class" />
      }
    </nav>
    <hr />
    <p>0 av 15 GB används</p>
    <app-nav-button label="Få mer lagringsutrymme" variant="secondary" class="get-storage" />
  `,
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  fileService = inject(FileHandlingService);

  dropdownOpen = signal(false);

  onNewButtonClick() {
    this.dropdownOpen.update((value) => !value);
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
