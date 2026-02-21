import { Component, Prop, h, Event, EventEmitter, Host } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const pageButtonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium',
    'transition-colors bg-transparent text-foreground border border-transparent cursor-pointer',
    'disabled:opacity-50 disabled:pointer-events-none',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'h-11 w-11 sm:h-10 sm:w-10',
  ].join(' '),
  {
    variants: {
      active: {
        true: 'bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground',
        false: '',
      },
      isNav: {
        true: 'w-auto px-3',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      isNav: false,
    },
  },
);

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-pagination',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class AndPagination {
  /** Total number of pages. */
  @Prop({ reflect: true }) totalPages: number = 1;

  /** Current active page (1-based). */
  @Prop({ reflect: true }) currentPage: number = 1;

  /** Emitted when the page changes. */
  @Event({ bubbles: true, composed: true }) andPageChange: EventEmitter<number>;

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handlePageChange = (page: number) => {
    if (page < 1 || page > this.totalPages) return;
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
