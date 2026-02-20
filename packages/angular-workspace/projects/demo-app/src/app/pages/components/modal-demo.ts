import {
  AndButton,
  AndModal,
} from '@angular-components/stencil-generated/components';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-modal-demo',
  imports: [AndButton, AndModal],
  schemas: [],
  template: `
    <div class="demo-section">
      <h2>Modal</h2>
      <p>Dialog overlay for important content</p>
      <and-button (click)="openModal()">Open Modal</and-button>

      <and-modal [open]="modalOpen()" (myClose)="closeModal()">
        <h3>Modal Title</h3>
        <p>This is the modal content. You can add any elements here.</p>
        <div
          style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;"
        >
          <and-button variant="ghost" (click)="closeModal()">Cancel</and-button>
          <and-button (click)="closeModal()">Confirm</and-button>
        </div>
      </and-modal>
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
