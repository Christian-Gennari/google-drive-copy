import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from './icons.service';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  template: `<span class="icon" [innerHTML]="svg"></span>`,
  styleUrls: ['./icons.component.scss'],
})
export class IconsComponent {
  svg: SafeHtml | null = null;

  @Input() set name(n: string | undefined) {
    this.svg = n
      ? this.iconService.get(n)
      : null;
  }

  constructor(private iconService: IconService) {}
}
