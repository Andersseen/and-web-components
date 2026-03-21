import {
  AndButton,
  AndIcon,
  AndSelect,
} from '@angular-components/stencil-generated/components';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import type { DropdownOption } from './navigation.data';

@Component({
  selector: 'app-navbar-desktop-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AndSelect, AndButton, AndIcon],
  template: `
    <div class="flex items-center gap-1">
      <div class="w-[152px] max-[1180px]:w-[136px]">
        <and-select
          label="Theme"
          [options]="themeOptions()"
          [value]="currentTheme()"
          (andSelectChange)="onThemeSelect($event)"
        ></and-select>
      </div>

      <div class="w-[170px] max-[1180px]:w-[150px]">
        <and-select
          label="Palette"
          [options]="colorOptions()"
          [value]="currentColor()"
          (andSelectChange)="onColorSelect($event)"
        ></and-select>
      </div>

      <and-button
        variant="ghost"
        size="icon"
        (click)="darkModeToggle.emit()"
        title="Toggle Dark Mode"
      >
        <and-icon [name]="isDark() ? 'sun' : 'moon'" />
      </and-button>

      <and-button size="sm" variant="link" href="https://libs.andersseen.dev">
        <and-icon name="app-window" size="16" />
        Home
      </and-button>

      <and-button
        size="sm"
        variant="link"
        href="https://github.com/Andersseen/and-web-components"
        target="_blank"
      >
        <and-icon name="github" size="16" />
        GitHub
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
