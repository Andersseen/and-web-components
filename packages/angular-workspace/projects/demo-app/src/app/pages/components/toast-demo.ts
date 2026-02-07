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
      <my-button (click)="showToast()">Show Toast</my-button>
      <my-toast #toast></my-toast>
    </div>
  `,
})
export default class ToastDemo {
  @ViewChild('toast') toastElement!: MyToast;

  async showToast() {
    if (this.toastElement) {
      await this.toastElement.present(
        'This is a toast notification!',
        'success',
      );
    }
  }
}
