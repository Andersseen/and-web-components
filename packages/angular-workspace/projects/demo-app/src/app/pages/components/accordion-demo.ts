import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AndAccordion,
  AndAccordionItem,
  AndAccordionTrigger,
  AndAccordionContent,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-accordion-demo',
  imports: [
    AndAccordion,
    AndAccordionItem,
    AndAccordionTrigger,
    AndAccordionContent,
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

      <and-accordion [allowMultiple]="allowMultiple()" [disabled]="disabled()">
        <and-accordion-item value="item-1">
          <and-accordion-trigger>What is Stencil?</and-accordion-trigger>
          <and-accordion-content>
            Stencil is a compiler that generates Web Components (specifically,
            Custom Elements). Stencil combines the best concepts of the most
            popular frameworks into a simple build-time tool.
          </and-accordion-content>
        </and-accordion-item>
        <and-accordion-item value="item-2">
          <and-accordion-trigger>Why use Web Components?</and-accordion-trigger>
          <and-accordion-content>
            Web Components are a set of web platform APIs that allow you to
            create new custom, reusable, encapsulated HTML tags to use in web
            pages and web apps.
          </and-accordion-content>
        </and-accordion-item>
        <and-accordion-item value="item-3">
          <and-accordion-trigger>What is Tailwind CSS?</and-accordion-trigger>
          <and-accordion-content>
            Tailwind CSS is a utility-first CSS framework that provides
            low-level utility classes to build custom designs.
          </and-accordion-content>
        </and-accordion-item>
      </and-accordion>
    </div>
  `,
})
export default class AccordionDemo {
  allowMultiple = signal(false);
  disabled = signal(false);
}
