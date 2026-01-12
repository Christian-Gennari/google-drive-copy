import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from './icons';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(private sanitizer: DomSanitizer) {}

  get(name: string): SafeHtml | null {
    const svg = ICONS[name];
    if (!svg) return null;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
