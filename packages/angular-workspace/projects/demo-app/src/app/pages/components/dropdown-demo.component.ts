import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Dropdown</h2>
      <p>Dropdown menu with selectable items</p>
      <my-dropdown [items]="dropdownItems">
        <my-button slot="trigger" label="Open Menu"></my-button>
      </my-dropdown>
    </div>
  `,
})
export class DropdownDemoComponent {
  dropdownItems = [
    { text: 'Option 1', value: '1' },
    { text: 'Option 2', value: '2' },
    { text: 'Option 3', value: '3' },
  ];
}
