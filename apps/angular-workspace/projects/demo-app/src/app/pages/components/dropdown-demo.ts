import { Component } from '@angular/core';
import {
  AndButton,
  AndDropdown,
} from '@angular-components/stencil-generated/components';
import {
  DemoHeaderComponent,
  DemoSectionComponent,
  DemoPreviewComponent,
  DemoCodeBlockComponent,
} from '../../shared';

@Component({
  selector: 'app-dropdown-demo',
  imports: [
    AndDropdown,
    AndButton,
    DemoHeaderComponent,
    DemoSectionComponent,
    DemoPreviewComponent,
    DemoCodeBlockComponent,
  ],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <demo-header
        title="Dropdown"
        description="A floating menu of actions or options, triggered by a button. Supports keyboard navigation and proper ARIA roles."
      />

      <demo-section title="Preview">
        <demo-preview>
          <div class="flex flex-col items-center gap-6">
            <p class="text-sm text-muted-foreground m-0">
              Click the button to reveal the dropdown
            </p>
            <and-dropdown [items]="actionItems">
              <and-button slot="trigger" variant="outline">
                Actions
                <svg
                  class="ml-2 inline-block"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </and-button>
            </and-dropdown>
          </div>
        </demo-preview>
      </demo-section>

      <demo-section title="Variations">
        <demo-preview>
          <div class="flex flex-col items-center gap-2">
            <span class="text-xs text-muted-foreground mb-1">Navigation</span>
            <and-dropdown [items]="navItems">
              <and-button slot="trigger" variant="default">Navigate</and-button>
            </and-dropdown>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-xs text-muted-foreground mb-1">Settings</span>
            <and-dropdown [items]="settingsItems">
              <and-button slot="trigger" variant="secondary">Settings</and-button>
            </and-dropdown>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-xs text-muted-foreground mb-1">Profile</span>
            <and-dropdown [items]="profileItems">
              <and-button slot="trigger" variant="ghost">Profile</and-button>
            </and-dropdown>
          </div>
        </demo-preview>
      </demo-section>

      <demo-section title="Usage">
        <demo-code-block label="Template" [code]="templateCode" />
        <demo-code-block label="Data" [code]="dataCode" />
      </demo-section>
    </div>
  `,
})
export default class DropdownDemo {
  actionItems = [
    { text: 'Edit', value: 'edit' },
    { text: 'Duplicate', value: 'duplicate' },
    { text: 'Archive', value: 'archive' },
    { text: 'Delete', value: 'delete' },
  ];

  navItems = [
    { text: 'Dashboard', value: 'dashboard' },
    { text: 'Settings', value: 'settings' },
    { text: 'Reports', value: 'reports' },
  ];

  settingsItems = [
    { text: 'General', value: 'general' },
    { text: 'Notifications', value: 'notifications' },
    { text: 'Privacy', value: 'privacy' },
  ];

  profileItems = [
    { text: 'My Account', value: 'account' },
    { text: 'Preferences', value: 'preferences' },
    { text: 'Sign Out', value: 'signout' },
  ];

  templateCode = `<and-dropdown [items]="menuItems">
  <and-button slot="trigger">Open Menu</and-button>
</and-dropdown>`;

  dataCode = `menuItems = [
  { text: 'Edit', value: 'edit' },
  { text: 'Duplicate', value: 'duplicate' },
  { text: 'Delete', value: 'delete' },
];`;
}
