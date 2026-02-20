import {
  AndButton,
  AndToast,
} from '@angular-components/stencil-generated/components';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-toast-demo',
  imports: [AndToast, AndButton],
  template: `
    <div class="demo-section">
      <h2>Toast</h2>
      <p>Temporary notification messages</p>
      <div class="flex gap-2">
        <and-button (click)="showToast('default')">Default</and-button>
        <and-button (click)="showToast('success')" variant="outline"
          >Success</and-button
        >
        <and-button (click)="showToast('error')" variant="destructive"
          >Error</and-button
        >
      </div>
      <and-toast #toast></and-toast>
    </div>
  `,
})
export default class ToastDemo {
  @ViewChild('toast') toastElement!: AndToast;

  async showToast(type: string = 'default') {
    if (this.toastElement) {
      await this.toastElement.present(
        `This is a ${type} toast notification!`,
        type as any,
      );
    }
  }
}
