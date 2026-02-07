import { Component } from '@angular/core';
import {
  MyAccordion,
  MyAccordionItem,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-accordion-demo',
  standalone: true,
  imports: [MyAccordion, MyAccordionItem],
  template: `
    <div class="demo-section">
      <h2>Accordion</h2>
      <p>Collapsible content panels for organizing information</p>
      <my-accordion>
        <my-accordion-item value="item-1" header="What is Stencil?" expanded>
          Stencil is a compiler that generates Web Components (specifically,
          Custom Elements). Stencil combines the best concepts of the most
          popular frameworks into a simple build-time tool.
        </my-accordion-item>
        <my-accordion-item value="item-2" header="Why use Web Components?">
          Web Components are a set of web platform APIs that allow you to create
          new custom, reusable, encapsulated HTML tags to use in web pages and
          web apps.
        </my-accordion-item>
        <my-accordion-item value="item-3" header="What is Tailwind CSS?">
          Tailwind CSS is a utility-first CSS framework that provides low-level
          utility classes to build custom designs.
        </my-accordion-item>
      </my-accordion>
    </div>
  `,
})
export class AccordionDemoComponent {}
