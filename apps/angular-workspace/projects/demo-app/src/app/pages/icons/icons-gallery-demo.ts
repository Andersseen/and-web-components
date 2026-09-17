import { AndIcon } from '@andersseen/angular-components';
import { Component } from '@angular/core';
import { ALL_ICONS } from '@andersseen/icon';

@Component({
  selector: 'app-icons-gallery-demo',
  imports: [AndIcon],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Icons</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A standalone, tree-shakable SVG icon catalog, usable either as a zero-JavaScript CSS attribute or through the
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">&lt;and-icon&gt;</code> Web Component — see
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">Examples</code> in the sidebar for both.
        </p>
        <div class="mt-4 flex items-center gap-2">
          <span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {{ allIcons.length }} icons
          </span>
          <span
            class="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            &#64;andersseen/icon
          </span>
        </div>
      </header>

      <!-- Search -->
      <section class="mb-8">
        <input
          type="text"
          placeholder="Search icons…"
          [value]="searchQuery"
          (input)="onSearch($event)"
          class="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </section>

      <!-- All Icons Grid -->
      <section>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-6">
            <div class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(110px, 1fr))">
              @for (icon of filteredIcons; track icon) {
                <button
                  class="flex flex-col items-center gap-2 rounded-lg border border-border p-3 transition-all hover:border-primary/40 hover:bg-accent cursor-pointer bg-transparent"
                  (click)="copyName(icon)"
                  [title]="'Copy: ' + icon"
                >
                  <and-icon [name]="icon" size="22"></and-icon>
                  <span class="text-[11px] text-muted-foreground text-center leading-tight truncate w-full">{{
                    icon
                  }}</span>
                </button>
              }
            </div>
            @if (filteredIcons.length === 0) {
              <p class="text-center text-muted-foreground py-8">No icons match "{{ searchQuery }}"</p>
            }
          </div>
        </div>
      </section>
    </div>
  `,
})
export default class IconsGalleryDemo {
  allIcons = Object.keys(ALL_ICONS).sort();
  searchQuery = '';
  filteredIcons = this.allIcons;

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = value;
    this.filteredIcons = value ? this.allIcons.filter(name => name.includes(value)) : this.allIcons;
  }

  copyName(name: string) {
    navigator.clipboard?.writeText(name);
  }
}
