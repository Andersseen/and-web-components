import { Component, Prop, h, Event, EventEmitter, Host } from '@stencil/core';
import { cn } from '../../utils/cn';
import { pageButtonVariants } from './and-pagination-variants';

/**
 * Page-number navigation (`nav aria-label="Pagination"`) with previous/next
 * controls. Renders one button per page — for very large `totalPages`,
 * consider paging through results some other way, since this doesn't
 * truncate with an ellipsis.
 *
 * @example
 * ```html
 * <and-pagination total-pages="10" current-page="1"></and-pagination>
 * ```
 */
@Component({
  tag: 'and-pagination',
  styleUrl: '../../global/component-base.css',
  shadow: true,
})
export class AndPagination {
  /** Total number of pages. */
  @Prop({ reflect: true }) totalPages: number = 1;

  /** Current active page (1-based). */
  @Prop({ reflect: true }) currentPage: number = 1;

  /** Emitted when the page changes. */
  @Event({ bubbles: true, composed: true }) andPageChange!: EventEmitter<number>;

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handlePageChange = (page: number) => {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.andPageChange.emit(page);
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    return (
      <Host class="flex items-center justify-center gap-1">
        <nav aria-label="Pagination" class="flex items-center gap-1">
          <button
            class={cn(pageButtonVariants({ isNav: true }))}
            onClick={() => this.handlePageChange(this.currentPage - 1)}
            disabled={this.currentPage <= 1}
            aria-label="Go to previous page"
          >
            <and-icon name="chevron-left" size={16} class="h-4 w-4" />
            <span class="sr-only">Previous</span>
          </button>

          {pages.map(page => (
            <button
              class={cn(pageButtonVariants({ active: this.currentPage === page }))}
              onClick={() => this.handlePageChange(page)}
              aria-current={this.currentPage === page ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          <button
            class={cn(pageButtonVariants({ isNav: true }))}
            onClick={() => this.handlePageChange(this.currentPage + 1)}
            disabled={this.currentPage >= this.totalPages}
            aria-label="Go to next page"
          >
            <and-icon name="chevron-right" size={16} class="h-4 w-4" />
            <span class="sr-only">Next</span>
          </button>
        </nav>
      </Host>
    );
  }
}
