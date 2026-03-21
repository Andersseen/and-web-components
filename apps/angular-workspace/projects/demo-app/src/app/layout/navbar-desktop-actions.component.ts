import {
  AndButton,
  AndDropdown,
  AndIcon,
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
  imports: [AndDropdown, AndButton, AndIcon],
  template: `
    <div class="hidden items-center gap-1 [@media(min-width:761px)]:flex">
      <div class="w-[102px] max-[1180px]:w-[92px]">
        <and-dropdown
          label="Theme"
          variant="ghost"
          [items]="themeOptions()"
          (andDropdownSelect)="onThemeSelect($event)"
        />
      </div>

      <div class="w-[102px] max-[1180px]:w-[92px]">
        <and-dropdown
          label="Palette"
          variant="ghost"
          [items]="colorOptions()"
          (andDropdownSelect)="onColorSelect($event)"
        />
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
