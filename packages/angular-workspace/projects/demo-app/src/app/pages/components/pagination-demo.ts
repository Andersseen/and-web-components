import { Component } from '@angular/core';
import { AndPagination } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-pagination-demo',
  imports: [AndPagination],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Pagination
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Navigate through pages of content. Provides clear affordances for
          moving between data sets, tables, or result lists.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-col items-center justify-center gap-6 min-h-[160px]"
          >
            <and-pagination total-pages="10" current-page="1"></and-pagination>
          </div>
        </div>
      </section>

      <!-- Contextual Example -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          In Context
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-6">
            <!-- Simulated table -->
            <div class="border border-border rounded-lg overflow-hidden mb-6">
              <div
                class="grid grid-cols-3 gap-4 px-4 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                <span>Name</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              @for (row of tableRows; track row.name) {
                <div
                  class="grid grid-cols-3 gap-4 px-4 py-3 border-b border-border last:border-b-0 text-sm text-foreground"
                >
                  <span>{{ row.name }}</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full w-fit"
                    [class]="
                      row.status === 'Active'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    "
                  >
                    {{ row.status }}
                  </span>
                  <span class="text-muted-foreground">{{ row.date }}</span>
                </div>
              }
            </div>
            <div class="flex justify-center">
              <and-pagination
                total-pages="5"
                current-page="1"
              ></and-pagination>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Template</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-pagination
  total-pages="10"
  current-page="1"
  (pageChange)="onPageChange($event)"
&gt;&lt;/and-pagination&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class PaginationDemo {
  tableRows = [
    { name: 'Project Alpha', status: 'Active', date: 'Feb 15, 2026' },
    { name: 'Project Beta', status: 'Draft', date: 'Feb 12, 2026' },
    { name: 'Project Gamma', status: 'Active', date: 'Feb 10, 2026' },
    { name: 'Project Delta', status: 'Draft', date: 'Feb 8, 2026' },
  ];
}
