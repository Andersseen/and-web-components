import { Component } from '@angular/core';
import {
  MyButton,
  MyDropdown,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-dropdown-demo',
  imports: [MyDropdown, MyButton],
  template: `
    <div class="demo-section">
      <h2>Dropdown</h2>
      <p>Dropdown menu with selectable items</p>
      <my-dropdown [items]="dropdownItems">
        <my-button slot="trigger">Open Menu</my-button>
      </my-dropdown>
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
