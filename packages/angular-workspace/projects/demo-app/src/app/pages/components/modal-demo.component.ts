import {
  MyButton,
  MyModal,
} from '@angular-components/stencil-generated/components';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-modal-demo',
  imports: [MyButton, MyModal],
  schemas: [],
  template: `
    <div class="demo-section">
      <h2>Modal</h2>
      <p>Dialog overlay for important content</p>
      <my-button (click)="openModal()">Open Modal</my-button>

      <my-modal [open]="modalOpen()" (myClose)="closeModal()">
        <h3>Modal Title</h3>
        <p>This is the modal content. You can add any elements here.</p>
        <div
          style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;"
        >
          <my-button variant="ghost" (click)="closeModal()">Cancel</my-button>
          <my-button (click)="closeModal()">Confirm</my-button>
        </div>
      </my-modal>
    </div>
  `,
})
export default class ModalDemo {
  modalOpen = signal(false);

  openModal() {
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }
}
