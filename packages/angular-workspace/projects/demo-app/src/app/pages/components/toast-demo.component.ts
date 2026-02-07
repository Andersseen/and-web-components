import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Toast</h2>
      <p>Temporary notification messages</p>
      <my-button label="Show Toast" (click)="showToast()"></my-button>
      <my-toast #toast></my-toast>
    </div>
  `,
})
export class ToastDemoComponent {
  @ViewChild('toast') toastElement!: ElementRef;

  async showToast() {
    if (this.toastElement && this.toastElement.nativeElement) {
      await this.toastElement.nativeElement.present(
        'This is a toast notification!',
        'success',
      );
    }
  }
}
