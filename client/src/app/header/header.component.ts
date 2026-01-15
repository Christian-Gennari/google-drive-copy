import { Component } from '@angular/core';
import { SearchbarComponent } from '../components/searchbar/searchbar.component';
import { NavButtonComponent } from '../components/nav-button/nav-button.component';

@Component({
  selector: 'app-header',
  imports: [SearchbarComponent, NavButtonComponent],
  template: `
    <header>
      <div class="brand">
        <img class="brand-logo" src="assets/duck-drive-icon.png" alt="logo" aria-hidden="true" />
        <h1>Drive</h1>
      </div>
      <app-searchbar class="header-search"></app-searchbar>
      <div class="header-icons">
        <nav>
          @for (item of headerItems; track item.label) {
          <app-nav-button [icon]="item.icon" [class]="item.class" [showLabelText]="false" />
          }
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  protected readonly headerItems = [
    { label: 'Support', class: 'support', icon: 'support' },
    { label: 'Inställningar', class: 'settings', icon: 'settings' },
    { label: 'Googles appar', class: 'google-apps', icon: 'apps' },
    { label: 'Google konto', class: 'google-account', icon: 'account' },
  ];
}
