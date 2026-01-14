import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { IconsComponent } from '../icons/icons.component';

@Component({
  selector: 'app-nav-button',
  imports: [IconsComponent],
  template: `
    <button [class]="class()" (click)="clicked.emit()">
      @if (icon()) {
      <app-icon [name]="icon()" />
      }
      <span class="label">{{ label() }}</span>
    </button>
  `,
  styleUrl: './nav-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
  },
})
export class NavButtonComponent {
  label = input<string>();
  icon = input<string>('');
  class = input<string>('');
  variant = input<'default' | 'primary' | 'secondary'>('default');
  clicked = output<void>();
}
