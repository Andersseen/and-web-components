import { Component } from '@angular/core';
import {
  AndButton,
  AndDropdown,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-dropdown-demo',
  imports: [AndDropdown, AndButton],
  template: `
    <div class="demo-section">
      <h2>Dropdown</h2>
      <p>Dropdown menu with selectable items</p>
      <and-dropdown [items]="dropdownItems">
        <and-button slot="trigger">Open Menu</and-button>
      </and-dropdown>
    </div>
  `,
})
export default class DropdownDemo {
  dropdownItems = [
    { text: 'Option 1', value: '1' },
    { text: 'Option 2', value: '2' },
    { text: 'Option 3', value: '3' },
  ];
}
