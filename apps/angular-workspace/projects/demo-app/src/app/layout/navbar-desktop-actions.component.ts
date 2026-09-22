import { AndButton, AndIcon, AndSelect } from '@andersseen/angular-components';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { DropdownOption } from './navigation.data';

@Component({
  selector: 'app-navbar-desktop-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AndSelect, AndButton, AndIcon],
  template: `
    <div class="flex items-center gap-2">
      <details class="relative">
        <summary
          aria-label="Customize demo appearance"
          title="Customize demo appearance"
          class="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground [&::-webkit-details-marker]:hidden"
        >
          <and-icon name="sliders" size="17" />
        </summary>
        <div
          class="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-xl border border-border bg-background p-3 shadow-xl"
        >
          <p class="mb-3 text-sm font-medium text-foreground">Demo appearance</p>
          <div class="space-y-3">
            <and-select
              label="Theme"
              [options]="themeOptions()"
              [value]="currentTheme()"
              (andSelectChange)="onThemeSelect($event)"
            ></and-select>
            <and-select
              label="Palette"
              [options]="colorOptions()"
              [value]="currentColor()"
              (andSelectChange)="onColorSelect($event)"
            ></and-select>
          </div>
        </div>
      </details>

      <details class="relative">
        <summary
          aria-label="Open resources"
          title="Open resources"
          class="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground [&::-webkit-details-marker]:hidden"
        >
          <and-icon name="book-open" size="17" />
        </summary>
        <div
          class="absolute right-0 top-[calc(100%+0.75rem)] z-50 grid w-44 gap-1 rounded-xl border border-border bg-background p-1.5 shadow-xl"
        >
          <a
            class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            href="https://libs.andersseen.dev"
          >
            <and-icon name="app-window" size="16" />
            Home
          </a>
          <a
            class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            href="https://github.com/Andersseen/and-web-components"
            target="_blank"
            rel="noreferrer"
          >
            <and-icon name="github" size="16" />
            GitHub
          </a>
        </div>
      </details>

      <and-button variant="outline" size="icon" (click)="darkModeToggle.emit()" title="Toggle Dark Mode">
        <and-icon [name]="isDark() ? 'sun' : 'moon'" />
      </and-button>
    </div>
  `,
})
export class NavbarDesktopActionsComponent {
  readonly themeOptions = input.required<DropdownOption[]>();
  readonly colorOptions = input.required<DropdownOption[]>();
  readonly currentTheme = input('default');
  readonly currentColor = input('indigo-rose');
  readonly isDark = input(false);

  readonly themeSelect = output<string>();
  readonly colorSelect = output<string>();
  readonly darkModeToggle = output<void>();

  onThemeSelect(event: CustomEvent<unknown>) {
    if (typeof event.detail !== 'string' || event.detail.length === 0) return;
    this.themeSelect.emit(event.detail);
  }

  onColorSelect(event: CustomEvent<unknown>) {
    if (typeof event.detail !== 'string' || event.detail.length === 0) return;
    this.colorSelect.emit(event.detail);
  }
}
