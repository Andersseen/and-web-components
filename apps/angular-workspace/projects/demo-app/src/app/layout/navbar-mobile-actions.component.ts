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
  selector: 'app-navbar-mobile-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AndSelect, AndButton, AndIcon],
  template: `
    <div class="w-full flex flex-col items-stretch gap-2">
      <div class="grid grid-cols-2 gap-2">
        <and-select
          label="Theme"
          [options]="themeOptions()"
          [value]="currentTheme()"
          [customClass]="'h-10 border-transparent bg-transparent shadow-none hover:bg-accent px-2 pr-8 font-semibold'"
          (andSelectChange)="onThemeSelect($event)"
        ></and-select>

        <and-select
          label="Palette"
          [options]="colorOptions()"
          [value]="currentColor()"
          [customClass]="'h-10 border-transparent bg-transparent shadow-none hover:bg-accent px-2 pr-8 font-semibold'"
          (andSelectChange)="onColorSelect($event)"
        ></and-select>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <and-button
          size="sm"
          variant="ghost"
          class="w-full justify-start"
          href="https://libs.andersseen.dev"
        >
          <and-icon name="app-window" size="16" />
          Home
        </and-button>

        <and-button
          size="sm"
          variant="ghost"
          class="w-full justify-start"
          href="https://github.com/Andersseen/and-web-components"
          target="_blank"
        >
          <and-icon name="github" size="16" />
          GitHub
        </and-button>
      </div>
    </div>
  `,
})
export class NavbarMobileActionsComponent {
  readonly themeOptions = input.required<DropdownOption[]>();
  readonly colorOptions = input.required<DropdownOption[]>();
  readonly currentTheme = input('default');
  readonly currentColor = input('indigo-rose');

  readonly themeSelect = output<string>();
  readonly colorSelect = output<string>();

  onThemeSelect(event: CustomEvent<unknown>) {
    if (typeof event.detail !== 'string' || event.detail.length === 0) return;
    this.themeSelect.emit(event.detail);
  }

  onColorSelect(event: CustomEvent<unknown>) {
    if (typeof event.detail !== 'string' || event.detail.length === 0) return;
    this.colorSelect.emit(event.detail);
  }
}
