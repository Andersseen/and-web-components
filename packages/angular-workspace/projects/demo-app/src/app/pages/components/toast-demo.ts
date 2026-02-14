import {
  MyButton,
  MyToast,
} from '@angular-components/stencil-generated/components';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-toast-demo',
  imports: [MyToast, MyButton],
  template: `
    <div class="demo-section">
      <h2>Toast</h2>
      <p>Temporary notification messages</p>
      <div class="flex gap-2">
        <my-button (click)="showToast('default')">Default</my-button>
        <my-button (click)="showToast('success')" variant="outline"
          >Success</my-button
        >
        <my-button (click)="showToast('error')" variant="destructive"
          >Error</my-button
        >
      </div>
      <my-toast #toast></my-toast>
    </div>
  `,
})
export default class ToastDemo {
  @ViewChild('toast') toastElement!: MyToast;

  async showToast(type: 'default' | 'success' | 'error' = 'default') {
    if (this.toastElement) {
      await this.toastElement.present(
        `This is a ${type} toast notification!`,
        type,
      );
    }
  }
}
