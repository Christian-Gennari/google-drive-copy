import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavButtonComponent } from '../components/nav-button/nav-button.component';

@Component({
  selector: 'app-aside',
  imports: [NavButtonComponent],
  template: `
    <aside>
      <nav>
        @for (item of asideItems; track item.label) {
        <app-nav-button
          [icon]="item.icon"
          [label]="item.label"
          [class]="item.class"
          [showLabelText]="false"
        />
        }
      </nav>
      <div class="spacer"></div>
    </aside>
  `,
  styleUrls: ['./aside.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideComponent {
  protected readonly asideItems = [
    { label: 'Keep', class: 'keep', icon: 'keep' },
    { label: 'Tasks', class: 'tasks', icon: 'task' },
    { label: 'Kontakter', class: 'contacts', icon: 'contacts' },
    { label: 'Hämta tillägg', class: 'get-add-ons', icon: 'plus' },
  ];
}
