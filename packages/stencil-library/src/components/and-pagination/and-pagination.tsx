import { Component, Prop, h, Event, EventEmitter, Host } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'and-pagination',
  styleUrl: '../../global/global.css',
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

    // Button base classes
    const buttonBaseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-transparent text-foreground border border-transparent cursor-pointer disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

    // Responsive size classes: Mobile h-11/w-11, Desktop h-10/w-10
    const sizeClass = "h-11 w-11 sm:h-10 sm:w-10";
    const navButtonClass = "w-auto px-3";

    return (
      <Host class="flex items-center justify-center gap-1">
        <nav aria-label="Pagination" class="flex items-center gap-1">
          <button
            class={cn(buttonBaseClass, sizeClass, navButtonClass)}
            onClick={() => this.handlePageChange(this.currentPage - 1)}
            disabled={this.currentPage <= 1}
          >
            <and-icon name="chevron-left" size={16} class="h-4 w-4" />
            <span class="sr-only">Previous</span>
          </button>

          {pages.map(page => (
            <button
              class={cn(
                buttonBaseClass,
                sizeClass,
                this.currentPage === page ? 'bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground' : ''
              )}
              onClick={() => this.handlePageChange(page)}
              aria-current={this.currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}

          <button
            class={cn(buttonBaseClass, sizeClass, navButtonClass)}
            onClick={() => this.handlePageChange(this.currentPage + 1)}
            disabled={this.currentPage >= this.totalPages}
          >
            <and-icon name="chevron-right" size={16} class="h-4 w-4" />
            <span class="sr-only">Next</span>
          </button>
        </nav>
      </Host>
    );
  }
}
