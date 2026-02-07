import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'stencil-library/components/my-card';
import 'stencil-library/components/my-icon';

@Component({
  selector: 'app-icons-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h1 class="section-title">Icons</h1>
      <p class="section-description">
        All available icons in the library (future separate package)
      </p>

      <my-card class="p-6">
        <div class="icons-grid">
          @for (icon of icons; track icon) {
            <div class="icon-item">
              <my-icon [name]="icon" size="24"></my-icon>
              <span class="icon-name">{{ icon }}</span>
            </div>
          }
        </div>
      </my-card>

      <my-card class="p-6" style="margin-top: 2rem">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem; font-weight: 600">
          Future Separate Package
        </h3>
        <p style="margin: 0; color: #6b7280">
          These icons are currently part of the component library but are
          designed to be extracted into a separate, standalone package. This
          will allow you to install and use the icons independently from the
          component library.
        </p>
        <div
          style="
            margin-top: 1rem;
            padding: 1rem;
            background: #f3f4f6;
            border-radius: 6px;
          "
        >
          <code style="color: #1f2937">npm install @your-org/icons</code>
        </div>
      </my-card>
    </div>
  `,
  styles: [
    `
      .demo-section {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .section-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #111827;
      }
      .section-description {
        font-size: 1.125rem;
        color: #6b7280;
        margin-bottom: 2rem;
      }
      .icons-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1.5rem;
        padding: 1rem 0;
      }
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.2s;
        cursor: pointer;
      }
      .icon-item:hover {
        border-color: #3b82f6;
        background: #eff6ff;
        transform: translateY(-2px);
      }
      .icon-name {
        font-size: 0.875rem;
        color: #4b5563;
        text-align: center;
      }
    `,
  ],
})
export class IconsDemoComponent {
  icons = [
    'close',
    'chevron-down',
    'chevron-left',
    'chevron-right',
    'arrow-up',
    'info',
    'error',
    'loader',
    'home',
    'layout',
    'layers',
    'image',
    'star',
    'settings',
    'user',
    'lock',
    'bell',
    'menu',
    'box',
    'file-text',
    'toggle-left',
    'list-ordered',
    'message-square',
  ];
}
