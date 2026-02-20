/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from 'stencil-library/components';

import { defineCustomElement as defineAndAccordion } from 'stencil-library/components/and-accordion.js';
import { defineCustomElement as defineAndAccordionContent } from 'stencil-library/components/and-accordion-content.js';
import { defineCustomElement as defineAndAccordionItem } from 'stencil-library/components/and-accordion-item.js';
import { defineCustomElement as defineAndAccordionTrigger } from 'stencil-library/components/and-accordion-trigger.js';
import { defineCustomElement as defineAndAlert } from 'stencil-library/components/and-alert.js';
import { defineCustomElement as defineAndBadge } from 'stencil-library/components/and-badge.js';
import { defineCustomElement as defineAndButton } from 'stencil-library/components/and-button.js';
import { defineCustomElement as defineAndCard } from 'stencil-library/components/and-card.js';
import { defineCustomElement as defineAndCarousel } from 'stencil-library/components/and-carousel.js';
import { defineCustomElement as defineAndCarouselItem } from 'stencil-library/components/and-carousel-item.js';
import { defineCustomElement as defineAndDrawer } from 'stencil-library/components/and-drawer.js';
import { defineCustomElement as defineAndDropdown } from 'stencil-library/components/and-dropdown.js';
import { defineCustomElement as defineAndIcon } from 'stencil-library/components/and-icon.js';
import { defineCustomElement as defineAndInput } from 'stencil-library/components/and-input.js';
import { defineCustomElement as defineAndModal } from 'stencil-library/components/and-modal.js';
import { defineCustomElement as defineAndNavbar } from 'stencil-library/components/and-navbar.js';
import { defineCustomElement as defineAndPagination } from 'stencil-library/components/and-pagination.js';
import { defineCustomElement as defineAndSidebar } from 'stencil-library/components/and-sidebar.js';
import { defineCustomElement as defineAndTabs } from 'stencil-library/components/and-tabs.js';
import { defineCustomElement as defineAndTabsContent } from 'stencil-library/components/and-tabs-content.js';
import { defineCustomElement as defineAndTabsList } from 'stencil-library/components/and-tabs-list.js';
import { defineCustomElement as defineAndTabsTrigger } from 'stencil-library/components/and-tabs-trigger.js';
import { defineCustomElement as defineAndToast } from 'stencil-library/components/and-toast.js';
import { defineCustomElement as defineAndTooltip } from 'stencil-library/components/and-tooltip.js';
@ProxyCmp({
  defineCustomElementFn: defineAndAccordion,
  inputs: ['allowMultiple', 'defaultValue', 'disabled', 'orientation']
})
@Component({
  selector: 'and-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['allowMultiple', 'defaultValue', 'disabled', 'orientation'],
})
export class AndAccordion {
  protected el: HTMLAndAccordionElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndAccordion extends Components.AndAccordion {}


@ProxyCmp({
  defineCustomElementFn: defineAndAccordionContent,
  methods: ['setItemProps']
})
@Component({
  selector: 'and-accordion-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class AndAccordionContent {
  protected el: HTMLAndAccordionContentElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndAccordionContent extends Components.AndAccordionContent {}


@ProxyCmp({
  defineCustomElementFn: defineAndAccordionItem,
  inputs: ['disabled', 'value'],
  methods: ['setAccordionLogic']
})
@Component({
  selector: 'and-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', { name: 'value', required: true }],
})
export class AndAccordionItem {
  protected el: HTMLAndAccordionItemElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndAccordionItem extends Components.AndAccordionItem {}


@ProxyCmp({
  defineCustomElementFn: defineAndAccordionTrigger,
  methods: ['setItemProps']
})
@Component({
  selector: 'and-accordion-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class AndAccordionTrigger {
  protected el: HTMLAndAccordionTriggerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndAccordionTrigger extends Components.AndAccordionTrigger {}


@ProxyCmp({
  defineCustomElementFn: defineAndAlert,
  inputs: ['dismissible', 'variant']
})
@Component({
  selector: 'and-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['dismissible', 'variant'],
  outputs: ['myDismiss'],
})
export class AndAlert {
  protected el: HTMLAndAlertElement;
  @Output() myDismiss = new EventEmitter<CustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndAlert extends Components.AndAlert {

  myDismiss: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndBadge,
  inputs: ['variant']
})
@Component({
  selector: 'and-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['variant'],
})
export class AndBadge {
  protected el: HTMLAndBadgeElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndBadge extends Components.AndBadge {}


@ProxyCmp({
  defineCustomElementFn: defineAndButton,
  inputs: ['customClass', 'disabled', 'loading', 'size', 'type', 'variant']
})
@Component({
  selector: 'and-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['customClass', 'disabled', 'loading', 'size', 'type', 'variant'],
})
export class AndButton {
  protected el: HTMLAndButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndButton extends Components.AndButton {}


@ProxyCmp({
  defineCustomElementFn: defineAndCard,
  inputs: ['variant']
})
@Component({
  selector: 'and-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['variant'],
})
export class AndCard {
  protected el: HTMLAndCardElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndCard extends Components.AndCard {}


@ProxyCmp({
  defineCustomElementFn: defineAndCarousel,
  inputs: ['autoplay', 'interval']
})
@Component({
  selector: 'and-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['autoplay', 'interval'],
})
export class AndCarousel {
  protected el: HTMLAndCarouselElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndCarousel extends Components.AndCarousel {}


@ProxyCmp({
  defineCustomElementFn: defineAndCarouselItem
})
@Component({
  selector: 'and-carousel-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class AndCarouselItem {
  protected el: HTMLAndCarouselItemElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndCarouselItem extends Components.AndCarouselItem {}


@ProxyCmp({
  defineCustomElementFn: defineAndDrawer,
  inputs: ['open', 'placement']
})
@Component({
  selector: 'and-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['open', 'placement'],
  outputs: ['myClose'],
})
export class AndDrawer {
  protected el: HTMLAndDrawerElement;
  @Output() myClose = new EventEmitter<CustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndDrawer extends Components.AndDrawer {
  /**
   * Emitted when the drawer is closed (backdrop click or close button).
   */
  myClose: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndDropdown,
  inputs: ['closeOnSelect', 'items', 'label', 'placement', 'variant']
})
@Component({
  selector: 'and-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['closeOnSelect', 'items', 'label', 'placement', 'variant'],
  outputs: ['dropdownSelect'],
})
export class AndDropdown {
  protected el: HTMLAndDropdownElement;
  @Output() dropdownSelect = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndDropdown extends Components.AndDropdown {

  dropdownSelect: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndIcon,
  inputs: ['color', 'name', 'size', 'strokeWidth']
})
@Component({
  selector: 'and-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'name', 'size', 'strokeWidth'],
})
export class AndIcon {
  protected el: HTMLAndIconElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndIcon extends Components.AndIcon {}


@ProxyCmp({
  defineCustomElementFn: defineAndInput,
  inputs: ['class', 'disabled', 'placeholder', 'type', 'value']
})
@Component({
  selector: 'and-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['class', 'disabled', 'placeholder', 'type', 'value'],
  outputs: ['myInput'],
})
export class AndInput {
  protected el: HTMLAndInputElement;
  @Output() myInput = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndInput extends Components.AndInput {

  myInput: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndModal,
  inputs: ['open']
})
@Component({
  selector: 'and-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['open'],
  outputs: ['myClose'],
})
export class AndModal {
  protected el: HTMLAndModalElement;
  @Output() myClose = new EventEmitter<CustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndModal extends Components.AndModal {

  myClose: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndNavbar,
  inputs: ['activeItem', 'items', 'variant']
})
@Component({
  selector: 'and-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activeItem', 'items', 'variant'],
  outputs: ['navItemClick'],
})
export class AndNavbar {
  protected el: HTMLAndNavbarElement;
  @Output() navItemClick = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndNavbar extends Components.AndNavbar {
  /**
   * Emitted when a navigation item is clicked
   */
  navItemClick: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndPagination,
  inputs: ['currentPage', 'totalPages']
})
@Component({
  selector: 'and-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['currentPage', 'totalPages'],
  outputs: ['pageChange'],
})
export class AndPagination {
  protected el: HTMLAndPaginationElement;
  @Output() pageChange = new EventEmitter<CustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndPagination extends Components.AndPagination {
  /**
   * Emitted when page changes
   */
  pageChange: EventEmitter<CustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndSidebar,
  inputs: ['activeItem', 'collapsed', 'items', 'variant']
})
@Component({
  selector: 'and-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activeItem', 'collapsed', 'items', 'variant'],
  outputs: ['sidebarItemClick', 'sidebarToggle'],
})
export class AndSidebar {
  protected el: HTMLAndSidebarElement;
  @Output() sidebarItemClick = new EventEmitter<CustomEvent<string>>();
  @Output() sidebarToggle = new EventEmitter<CustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndSidebar extends Components.AndSidebar {
  /**
   * Emitted when a navigation item is clicked
   */
  sidebarItemClick: EventEmitter<CustomEvent<string>>;
  /**
   * Emitted when the sidebar collapse state changes
   */
  sidebarToggle: EventEmitter<CustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndTabs,
  inputs: ['activationMode', 'defaultValue', 'orientation', 'value']
})
@Component({
  selector: 'and-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activationMode', 'defaultValue', 'orientation', 'value'],
  outputs: ['valueChange'],
})
export class AndTabs {
  protected el: HTMLAndTabsElement;
  @Output() valueChange = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndTabs extends Components.AndTabs {

  valueChange: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndTabsContent,
  inputs: ['selected', 'value']
})
@Component({
  selector: 'and-tabs-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['selected', 'value'],
})
export class AndTabsContent {
  protected el: HTMLAndTabsContentElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndTabsContent extends Components.AndTabsContent {}


@ProxyCmp({
  defineCustomElementFn: defineAndTabsList,
  inputs: ['orientation']
})
@Component({
  selector: 'and-tabs-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['orientation'],
})
export class AndTabsList {
  protected el: HTMLAndTabsListElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndTabsList extends Components.AndTabsList {}


@ProxyCmp({
  defineCustomElementFn: defineAndTabsTrigger,
  inputs: ['disabled', 'selected', 'tabsLogic', 'value']
})
@Component({
  selector: 'and-tabs-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'selected', 'tabsLogic', 'value'],
  outputs: ['tabTriggerClick'],
})
export class AndTabsTrigger {
  protected el: HTMLAndTabsTriggerElement;
  @Output() tabTriggerClick = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndTabsTrigger extends Components.AndTabsTrigger {

  tabTriggerClick: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndToast,
  methods: ['present']
})
@Component({
  selector: 'and-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class AndToast {
  protected el: HTMLAndToastElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndToast extends Components.AndToast {}


@ProxyCmp({
  defineCustomElementFn: defineAndTooltip,
  inputs: ['closeDelay', 'content', 'openDelay', 'placement']
})
@Component({
  selector: 'and-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['closeDelay', 'content', 'openDelay', 'placement'],
})
export class AndTooltip {
  protected el: HTMLAndTooltipElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndTooltip extends Components.AndTooltip {}


