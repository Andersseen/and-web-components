import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AndBadge } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  imports: [CommonModule, AndBadge],
  template: `
    <div class="demo-section">
      <h2>Badge</h2>
      <p>Small status indicators</p>
      <div class="flex gap-4 items-center flex-wrap">
        <and-badge variant="default">Default</and-badge>
        <and-badge variant="secondary">Secondary</and-badge>
        <and-badge variant="destructive">Destructive</and-badge>
        <and-badge variant="outline">Outline</and-badge>
      </div>
    </div>
  `,
})
export default class BadgeDemo {}
