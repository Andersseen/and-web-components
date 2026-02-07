import { Component } from '@angular/core';
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
  ],
  template: `
    <div class="demo-section">
      <h2>Accordion</h2>
      <p>Collapsible content panels for organizing information</p>
      <my-accordion>
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
export default class AccordionDemo {}
