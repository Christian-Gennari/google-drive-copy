import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { FileHandlingService } from './services/file-handling.service';
import { MainviewComponent } from './mainview/mainview.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    AsideComponent,
    MainviewComponent,
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
    </div>
  `,
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  private fileService = inject(FileHandlingService);
  async ngOnInit() {
    // Fetch all files when app starts
    await this.fileService.fetchAllFiles();
  }
}
