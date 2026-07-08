import { DemoCodeBlockComponent } from '../../shared';
import { Component } from '@angular/core';
import { AndMenuList, AndMenuItem, AndIcon } from '@andersseen/angular-components';

@Component({
  selector: 'app-menu-list-demo',
  imports: [AndMenuList, AndMenuItem, AndIcon, DemoCodeBlockComponent],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Menu List</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A semantically structured menu of actions using proper list roles. Supports intent variants, disabled states,
          and keyboard navigation for accessible, modern UIs.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Preview</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-10 flex flex-col items-center justify-center gap-6 min-h-[200px]">
            <div class="w-64 rounded-md border border-border bg-popover shadow-md overflow-hidden">
              <and-menu-list ariaMenuLabel="File actions">
                <and-menu-item value="edit">
                  <and-icon slot="start" name="pencil" size="16"></and-icon>
                  Edit
                </and-menu-item>
                <and-menu-item value="duplicate">
                  <and-icon slot="start" name="copy" size="16"></and-icon>
                  Duplicate
                </and-menu-item>
                <and-menu-item value="archive">
                  <and-icon slot="start" name="archive" size="16"></and-icon>
                  Archive
                </and-menu-item>
                <and-menu-item value="delete" intent="destructive">
                  <and-icon slot="start" name="trash" size="16"></and-icon>
                  Delete
                </and-menu-item>
              </and-menu-list>
            </div>
          </div>
        </div>
      </section>

      <!-- Intents -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Intents &amp; States</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-10 flex flex-wrap items-start justify-center gap-8 min-h-[200px]">
            <!-- Default intent -->
            <div class="flex flex-col items-center gap-2">
              <span class="text-xs text-muted-foreground mb-1">Default</span>
              <div class="w-56 rounded-md border border-border bg-popover shadow-md overflow-hidden">
                <and-menu-list ariaMenuLabel="Default items">
                  <and-menu-item value="profile">Profile</and-menu-item>
                  <and-menu-item value="settings">Settings</and-menu-item>
                  <and-menu-item value="billing">Billing</and-menu-item>
                </and-menu-list>
              </div>
            </div>

            <!-- Destructive intent -->
            <div class="flex flex-col items-center gap-2">
              <span class="text-xs text-muted-foreground mb-1">Destructive</span>
              <div class="w-56 rounded-md border border-border bg-popover shadow-md overflow-hidden">
                <and-menu-list ariaMenuLabel="Danger zone">
                  <and-menu-item value="reset" intent="destructive"> Reset Data </and-menu-item>
                  <and-menu-item value="revoke" intent="destructive"> Revoke Access </and-menu-item>
                  <and-menu-item value="delete-account" intent="destructive"> Delete Account </and-menu-item>
                </and-menu-list>
              </div>
            </div>

            <!-- Disabled -->
            <div class="flex flex-col items-center gap-2">
              <span class="text-xs text-muted-foreground mb-1">Disabled</span>
              <div class="w-56 rounded-md border border-border bg-popover shadow-md overflow-hidden">
                <and-menu-list ariaMenuLabel="Mixed states">
                  <and-menu-item value="open">Open</and-menu-item>
                  <and-menu-item value="save" disabled> Save (disabled) </and-menu-item>
                  <and-menu-item value="export" disabled> Export (disabled) </and-menu-item>
                </and-menu-list>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <demo-code-block label="Template" [code]="templateCode" />
      </section>
    </div>
  `,
})
export default class MenuListDemo {
  templateCode = `<and-menu-list ariaMenuLabel="Actions">
  <and-menu-item value="edit">Edit</and-menu-item>
  <and-menu-item value="duplicate">Duplicate</and-menu-item>
  <and-menu-item value="delete" intent="destructive">Delete</and-menu-item>
  <and-menu-item value="locked" disabled>Locked</and-menu-item>
</and-menu-list>`;
}
