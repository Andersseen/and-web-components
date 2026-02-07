import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'stencil-library/components/my-modal';
import 'stencil-library/components/my-button';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Modal</h2>
      <p>Dialog overlay for important content</p>
      <my-button label="Open Modal" (click)="openModal()"></my-button>

      <my-modal [open]="modalOpen()" (myClose)="closeModal()">
        <h3 slot="header">Modal Title</h3>
        <p>This is the modal content. You can add any elements here.</p>
        <div slot="footer">
          <my-button
            label="Cancel"
            variant="ghost"
            (click)="closeModal()"
          ></my-button>
          <my-button label="Confirm" (click)="closeModal()"></my-button>
        </div>
      </my-modal>
    </div>
  `,
})
export class ModalDemoComponent {
  modalOpen = signal(false);

  openModal() {
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }
}
