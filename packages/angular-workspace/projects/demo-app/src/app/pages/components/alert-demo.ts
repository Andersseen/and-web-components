import { Component } from '@angular/core';
import {
  AndAlert,
  AndIcon,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  imports: [AndAlert, AndIcon],
  template: `
    <div class="demo-section">
      <h2>Alert</h2>
      <p>Display important messages to users</p>
      <div style="display: flex; flex-direction: column; gap: 1rem">
        <and-alert variant="default">
          <and-icon slot="icon" name="info" size="18"></and-icon>
          This is a default alert message.
        </and-alert>
        <and-alert variant="destructive">
          <and-icon slot="icon" name="alert-circle" size="18"></and-icon>
          This is a destructive alert message.
        </and-alert>
        <and-alert variant="default" dismissible>
          <and-icon slot="icon" name="info" size="18"></and-icon>
          This is a dismissible alert. Click the X to close.
        </and-alert>
      </div>
    </div>
  `,
})
export default class AlertDemo {}
