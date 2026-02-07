import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyBadge } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  imports: [CommonModule, MyBadge],
  template: `
    <div class="demo-section">
      <h2>Badge</h2>
      <p>Small status indicators</p>
      <div class="flex gap-4 items-center flex-wrap">
        <my-badge variant="default">Default</my-badge>
        <my-badge variant="secondary">Secondary</my-badge>
        <my-badge variant="destructive">Destructive</my-badge>
        <my-badge variant="outline">Outline</my-badge>
      </div>
    </div>
  `,
})
export class BadgeDemoComponent {}
