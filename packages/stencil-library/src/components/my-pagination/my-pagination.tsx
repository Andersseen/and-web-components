import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-pagination',
  styleUrl: 'my-pagination.css',
  shadow: true,
})
export class MyPagination {
  /**
   * total number of pages
   */
  @Prop() totalPages: number = 1;

  /**
   * current page number
   */
  @Prop() currentPage: number = 1;

  /**
   * Emitted when page changes
   */
  @Event() pageChange: EventEmitter<number>;

  private handlePageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  render() {
    const pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Simple limiting logic could be added here for many pages

    return (
      <nav aria-label="Pagination">
        <button class="pagination-button nav-button" onClick={() => this.handlePageChange(this.currentPage - 1)} disabled={this.currentPage <= 1}>
          <my-icon name="chevron-left" class="h-4 w-4" />
          <span class="sr-only">Previous</span>
        </button>

        {pages.map(page => (
          <button
            class={cn('pagination-button', this.currentPage === page ? 'active' : '')}
            onClick={() => this.handlePageChange(page)}
            aria-current={this.currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        <button class="pagination-button nav-button" onClick={() => this.handlePageChange(this.currentPage + 1)} disabled={this.currentPage >= this.totalPages}>
          <my-icon name="chevron-right" class="h-4 w-4" />
          <span class="sr-only">Next</span>
        </button>
      </nav>
    );
  }
}
