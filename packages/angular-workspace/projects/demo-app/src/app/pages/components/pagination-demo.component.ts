import { MyPagination } from '@angular-components/stencil-generated/components';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-demo',
  imports: [MyPagination],
  template: `
    <div class="demo-section">
      <h2>Pagination</h2>
      <p>Navigate through pages of content</p>
      <my-pagination total-pages="10" current-page="1"></my-pagination>
    </div>
  `,
})
export default class PaginationDemo {}
