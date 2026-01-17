import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { MainviewComponent } from './mainview/mainview.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    AsideComponent,
    MainviewComponent,
    ToastComponent,
  ],
  template: `
    <div class="app-layout">
      <app-header></app-header>
      <app-sidebar></app-sidebar>

      <main class="main">
        <app-mainview></app-mainview>

        <router-outlet></router-outlet>
      </main>
      <app-aside></app-aside>
      <app-toast></app-toast>
    </div>
  `,
  styleUrls: ['./app.scss'],
})
export class App {}
