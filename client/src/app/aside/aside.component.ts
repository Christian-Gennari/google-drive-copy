import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavButtonComponent } from '../components/nav-button/nav-button.component';

@Component({
  selector: 'app-aside',
  imports: [NavButtonComponent],
  template: `
  <aside>
    <nav>
      <app-nav-button label="Nytt" icon="plus" variant="primary" cssClass="aside-button" />
      @for (item of asideItems; track item.label) {
      <app-nav-button [label]="item.label" [icon]="item.icon" [cssClass]="item.cssClass" />
      }
    </nav>
  <aside>
  `,
  styleUrls: ['./aside.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideComponent {
  protected readonly asideItems = [
    { label: 'Keep', cssClass: 'keep', icon: 'keep' },
    { label: 'Tasks', cssClass: 'tasks', icon: 'task' },
    { label: 'Kontakter', cssClass: 'contacts', icon: 'contacts' },
    { label: 'Hämta tillägg', cssClass: 'get-add-ons', icon: 'add-on' },
  ];
}
