import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Alert</h2>
      <p>Display important messages to users</p>
      <div style="display: flex; flex-direction: column; gap: 1rem">
        <my-alert variant="default">
          <my-icon slot="icon" name="info" size="18"></my-icon>
          This is a default alert message.
        </my-alert>
        <my-alert variant="destructive">
          <my-icon slot="icon" name="error" size="18"></my-icon>
          This is a destructive alert message.
        </my-alert>
      </div>
    </div>
  `,
})
export class AlertDemoComponent {}
