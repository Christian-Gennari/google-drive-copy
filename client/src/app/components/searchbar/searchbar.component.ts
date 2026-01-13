import { Component } from '@angular/core';
import {IconService} from '../icons/icons.service';
import {IconsComponent} from '../icons/icons.component';

@Component({
  selector: 'app-searchbar',
  imports: [IconsComponent],
  template: `
    <div class="searchbar">
  <span class="searchbar__icon" aria-hidden="true">
    <app-icon [name]="'search'"></app-icon>
  </span>
      <input
        class="searchbar__input"
        type="search"
        placeholder="Sök på Drive"
        aria-label="Search"
      />
    </div>
  `,
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {

}
