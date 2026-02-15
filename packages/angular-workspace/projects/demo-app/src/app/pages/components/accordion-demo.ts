import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MyAccordion,
  MyAccordionItem,
  MyAccordionTrigger,
  MyAccordionContent,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-accordion-demo',
  imports: [
    MyAccordion,
    MyAccordionItem,
    MyAccordionTrigger,
    MyAccordionContent,
    FormsModule,
  ],
  template: `
    <div class="demo-section">
      <h2>Accordion</h2>
      <p>Collapsible content panels for organizing information</p>

      <div class="flex gap-4 mb-4">
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            [ngModel]="allowMultiple()"
            (ngModelChange)="allowMultiple.set($event)"
          />
          Allow Multiple
        </label>
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            [ngModel]="disabled()"
            (ngModelChange)="disabled.set($event)"
          />
          Disabled
        </label>
      </div>

      <my-accordion [allowMultiple]="allowMultiple()" [disabled]="disabled()">
        <my-accordion-item value="item-1">
          <my-accordion-trigger>What is Stencil?</my-accordion-trigger>
          <my-accordion-content>
            Stencil is a compiler that generates Web Components (specifically,
            Custom Elements). Stencil combines the best concepts of the most
            popular frameworks into a simple build-time tool.
          </my-accordion-content>
        </my-accordion-item>
        <my-accordion-item value="item-2">
          <my-accordion-trigger>Why use Web Components?</my-accordion-trigger>
          <my-accordion-content>
            Web Components are a set of web platform APIs that allow you to
            create new custom, reusable, encapsulated HTML tags to use in web
            pages and web apps.
          </my-accordion-content>
        </my-accordion-item>
        <my-accordion-item value="item-3">
          <my-accordion-trigger>What is Tailwind CSS?</my-accordion-trigger>
          <my-accordion-content>
            Tailwind CSS is a utility-first CSS framework that provides
            low-level utility classes to build custom designs.
          </my-accordion-content>
        </my-accordion-item>
      </my-accordion>
    </div>
  `,
})
export default class AccordionDemo {
  allowMultiple = signal(false);
  disabled = signal(false);
}
