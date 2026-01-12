import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-header></app-header>
      <app-sidebar></app-sidebar>
    </div>
  `,
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('client');
}
