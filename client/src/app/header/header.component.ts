import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
  <header>
    <img class="brand-logo" src="/client/public/duck-drive-icon.png" alt="logo" aria-hidden="true" />
    <h1>Drive</h1>
    <input class="search" type="text" placeholder="Sök på Drive     ⍯" />
  </header>
    `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

}
