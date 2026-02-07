import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Pagination</h2>
      <p>Navigate through pages of content</p>
      <my-pagination total-pages="10" current-page="1"></my-pagination>
    </div>
  `,
})
export class PaginationDemoComponent {}
