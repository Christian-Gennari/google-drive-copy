import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '../components/icons/icons.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, IconsComponent],
  template: `
    <nav>
      <button class="new-button"> + Nytt</button>
      <button *ngFor="let item of navItems" [ngClass]="item.cssClass">
        <app-icon [name]="item.icon"></app-icon>
        <span class="label">{{ item.label }}</span>
      </button>
    </nav>
    <hr/>
    <p>0 byte av 15 GB används</p>
    <button class="get-storage">Få mer lagringsutrymme</button>
  `,
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  protected navItems = [
    { label: 'Startsida', cssClass: 'home-page', icon: 'home' },
    { label: 'Min enhet', cssClass: 'my-unit', icon: 'my-unit' },
    { label: 'Datorer', cssClass: 'computers', icon: 'computer' },
    { label: 'Delas med mig', cssClass: 'shared-with-me', icon: 'shared-with-me' },
    { label: 'Senaste', cssClass: 'latest', icon: 'latest' },
    { label: 'Stjärnmärkt', cssClass: 'marked', icon: 'marked️' },
    { label: 'Skräppost', cssClass: 'trash', icon: 'trash️' },
    { label: 'Papperskorg', cssClass: 'bin', icon: 'bin' },
    { label: 'Lagring', cssClass: 'storage', icon: 'storage' },
  ];
}
