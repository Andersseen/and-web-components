import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Tabs</h2>
      <p>Organize content into tabbed sections</p>
      <my-tabs value="tab1">
        <my-tabs-list class="grid w-full grid-cols-3">
          <my-tabs-trigger value="tab1">Profile</my-tabs-trigger>
          <my-tabs-trigger value="tab2">Settings</my-tabs-trigger>
          <my-tabs-trigger value="tab3">Messages</my-tabs-trigger>
        </my-tabs-list>
        <my-tabs-content value="tab1">
          <div style="padding: 1rem">
            <h3 style="margin: 0 0 0.5rem 0">Profile Content</h3>
            <p style="margin: 0; color: #6b7280">
              This is the profile tab content.
            </p>
          </div>
        </my-tabs-content>
        <my-tabs-content value="tab2">
          <div style="padding: 1rem">
            <h3 style="margin: 0 0 0.5rem 0">Settings Content</h3>
            <p style="margin: 0; color: #6b7280">
              This is the settings tab content.
            </p>
          </div>
        </my-tabs-content>
        <my-tabs-content value="tab3">
          <div style="padding: 1rem">
            <h3 style="margin: 0 0 0.5rem 0">Messages Content</h3>
            <p style="margin: 0; color: #6b7280">
              This is the messages tab content.
            </p>
          </div>
        </my-tabs-content>
      </my-tabs>
    </div>
  `,
})
export class TabsDemoComponent {}
