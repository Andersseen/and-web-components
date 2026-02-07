/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from 'stencil-library/components';

import { defineCustomElement as defineMyAccordion } from 'stencil-library/components/my-accordion.js';
import { defineCustomElement as defineMyAccordionContent } from 'stencil-library/components/my-accordion-content.js';
import { defineCustomElement as defineMyAccordionItem } from 'stencil-library/components/my-accordion-item.js';
import { defineCustomElement as defineMyAccordionTrigger } from 'stencil-library/components/my-accordion-trigger.js';
import { defineCustomElement as defineMyAlert } from 'stencil-library/components/my-alert.js';
import { defineCustomElement as defineMyBadge } from 'stencil-library/components/my-badge.js';
import { defineCustomElement as defineMyButton } from 'stencil-library/components/my-button.js';
import { defineCustomElement as defineMyCard } from 'stencil-library/components/my-card.js';
import { defineCustomElement as defineMyCarousel } from 'stencil-library/components/my-carousel.js';
import { defineCustomElement as defineMyCarouselItem } from 'stencil-library/components/my-carousel-item.js';
import { defineCustomElement as defineMyDrawer } from 'stencil-library/components/my-drawer.js';
import { defineCustomElement as defineMyDropdown } from 'stencil-library/components/my-dropdown.js';
import { defineCustomElement as defineMyIcon } from 'stencil-library/components/my-icon.js';
import { defineCustomElement as defineMyInput } from 'stencil-library/components/my-input.js';
import { defineCustomElement as defineMyModal } from 'stencil-library/components/my-modal.js';
import { defineCustomElement as defineMyNavbar } from 'stencil-library/components/my-navbar.js';
import { defineCustomElement as defineMyPagination } from 'stencil-library/components/my-pagination.js';
import { defineCustomElement as defineMySidebar } from 'stencil-library/components/my-sidebar.js';
import { defineCustomElement as defineMyTabs } from 'stencil-library/components/my-tabs.js';
import { defineCustomElement as defineMyTabsContent } from 'stencil-library/components/my-tabs-content.js';
import { defineCustomElement as defineMyTabsList } from 'stencil-library/components/my-tabs-list.js';
import { defineCustomElement as defineMyTabsTrigger } from 'stencil-library/components/my-tabs-trigger.js';
import { defineCustomElement as defineMyToast } from 'stencil-library/components/my-toast.js';
import { defineCustomElement as defineMyTooltip } from 'stencil-library/components/my-tooltip.js';
@ProxyCmp({
  defineCustomElementFn: defineMyAccordion,
  inputs: ['collapsible', 'defaultValue', 'type', 'value']
})
@Component({
  selector: 'my-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['collapsible', 'defaultValue', 'type', 'value'],
  outputs: ['myValueChange'],
})
export class MyAccordion {
  protected el: HTMLMyAccordionElement;
  @Output() myValueChange = new EventEmitter<CustomEvent<string | string[]>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyAccordion extends Components.MyAccordion {

  myValueChange: EventEmitter<CustomEvent<string | string[]>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyAccordionContent,
  inputs: ['open']
})
@Component({
  selector: 'my-accordion-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['open'],
})
export class MyAccordionContent {
  protected el: HTMLMyAccordionContentElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyAccordionContent extends Components.MyAccordionContent {}


@ProxyCmp({
  defineCustomElementFn: defineMyAccordionItem,
  inputs: ['disabled', 'open', 'value']
})
@Component({
  selector: 'my-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'open', 'value'],
})
export class MyAccordionItem {
  protected el: HTMLMyAccordionItemElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyAccordionItem extends Components.MyAccordionItem {}


@ProxyCmp({
  defineCustomElementFn: defineMyAccordionTrigger,
  inputs: ['disabled', 'open', 'value']
})
@Component({
  selector: 'my-accordion-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'open', 'value'],
  outputs: ['accordionTriggerClick'],
})
export class MyAccordionTrigger {
  protected el: HTMLMyAccordionTriggerElement;
  @Output() accordionTriggerClick = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyAccordionTrigger extends Components.MyAccordionTrigger {

  accordionTriggerClick: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyAlert,
  inputs: ['variant']
})
@Component({
  selector: 'my-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['variant'],
})
export class MyAlert {
  protected el: HTMLMyAlertElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyAlert extends Components.MyAlert {}


@ProxyCmp({
  defineCustomElementFn: defineMyBadge,
  inputs: ['variant']
})
@Component({
  selector: 'my-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['variant'],
})
export class MyBadge {
  protected el: HTMLMyBadgeElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyBadge extends Components.MyBadge {}


@ProxyCmp({
  defineCustomElementFn: defineMyButton,
  inputs: ['customClass', 'disabled', 'size', 'type', 'variant']
})
@Component({
  selector: 'my-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['customClass', 'disabled', 'size', 'type', 'variant'],
})
export class MyButton {
  protected el: HTMLMyButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyButton extends Components.MyButton {}


@ProxyCmp({
  defineCustomElementFn: defineMyCard,
  inputs: ['variant']
})
@Component({
  selector: 'my-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['variant'],
})
export class MyCard {
  protected el: HTMLMyCardElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyCard extends Components.MyCard {}


@ProxyCmp({
  defineCustomElementFn: defineMyCarousel,
  inputs: ['autoplay', 'interval']
})
@Component({
  selector: 'my-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['autoplay', 'interval'],
})
export class MyCarousel {
  protected el: HTMLMyCarouselElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyCarousel extends Components.MyCarousel {}


@ProxyCmp({
  defineCustomElementFn: defineMyCarouselItem
})
@Component({
  selector: 'my-carousel-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class MyCarouselItem {
  protected el: HTMLMyCarouselItemElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyCarouselItem extends Components.MyCarouselItem {}


@ProxyCmp({
  defineCustomElementFn: defineMyDrawer,
  inputs: ['open', 'placement']
})
@Component({
  selector: 'my-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['open', 'placement'],
  outputs: ['myClose'],
})
export class MyDrawer {
  protected el: HTMLMyDrawerElement;
  @Output() myClose = new EventEmitter<CustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyDrawer extends Components.MyDrawer {
  /**
   * Emitted when the drawer is closed (backdrop click or close button).
   */
  myClose: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyDropdown,
  inputs: ['items', 'label', 'variant']
})
@Component({
  selector: 'my-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['items', 'label', 'variant'],
  outputs: ['dropdownSelect'],
})
export class MyDropdown {
  protected el: HTMLMyDropdownElement;
  @Output() dropdownSelect = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyDropdown extends Components.MyDropdown {

  dropdownSelect: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyIcon,
  inputs: ['color', 'name', 'size', 'strokeWidth']
})
@Component({
  selector: 'my-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'name', 'size', 'strokeWidth'],
})
export class MyIcon {
  protected el: HTMLMyIconElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyIcon extends Components.MyIcon {}


@ProxyCmp({
  defineCustomElementFn: defineMyInput,
  inputs: ['class', 'disabled', 'placeholder', 'type', 'value']
})
@Component({
  selector: 'my-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['class', 'disabled', 'placeholder', 'type', 'value'],
  outputs: ['myInput'],
})
export class MyInput {
  protected el: HTMLMyInputElement;
  @Output() myInput = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyInput extends Components.MyInput {

  myInput: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyModal,
  inputs: ['open']
})
@Component({
  selector: 'my-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['open'],
  outputs: ['myClose'],
})
export class MyModal {
  protected el: HTMLMyModalElement;
  @Output() myClose = new EventEmitter<CustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyModal extends Components.MyModal {

  myClose: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyNavbar,
  inputs: ['activeItem', 'items']
})
@Component({
  selector: 'my-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activeItem', 'items'],
  outputs: ['navItemClick'],
})
export class MyNavbar {
  protected el: HTMLMyNavbarElement;
  @Output() navItemClick = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyNavbar extends Components.MyNavbar {
  /**
   * Emitted when a navigation item is clicked
   */
  navItemClick: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyPagination,
  inputs: ['currentPage', 'totalPages']
})
@Component({
  selector: 'my-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['currentPage', 'totalPages'],
  outputs: ['pageChange'],
})
export class MyPagination {
  protected el: HTMLMyPaginationElement;
  @Output() pageChange = new EventEmitter<CustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyPagination extends Components.MyPagination {
  /**
   * Emitted when page changes
   */
  pageChange: EventEmitter<CustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMySidebar,
  inputs: ['activeItem', 'collapsed', 'items']
})
@Component({
  selector: 'my-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activeItem', 'collapsed', 'items'],
  outputs: ['sidebarItemClick', 'sidebarToggle'],
})
export class MySidebar {
  protected el: HTMLMySidebarElement;
  @Output() sidebarItemClick = new EventEmitter<CustomEvent<string>>();
  @Output() sidebarToggle = new EventEmitter<CustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MySidebar extends Components.MySidebar {
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
  defineCustomElementFn: defineMyTabs,
  inputs: ['defaultValue', 'orientation', 'value']
})
@Component({
  selector: 'my-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['defaultValue', 'orientation', 'value'],
  outputs: ['valueChange'],
})
export class MyTabs {
  protected el: HTMLMyTabsElement;
  @Output() valueChange = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyTabs extends Components.MyTabs {

  valueChange: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyTabsContent,
  inputs: ['selected', 'value']
})
@Component({
  selector: 'my-tabs-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['selected', 'value'],
})
export class MyTabsContent {
  protected el: HTMLMyTabsContentElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyTabsContent extends Components.MyTabsContent {}


@ProxyCmp({
  defineCustomElementFn: defineMyTabsList
})
@Component({
  selector: 'my-tabs-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class MyTabsList {
  protected el: HTMLMyTabsListElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyTabsList extends Components.MyTabsList {}


@ProxyCmp({
  defineCustomElementFn: defineMyTabsTrigger,
  inputs: ['disabled', 'selected', 'value']
})
@Component({
  selector: 'my-tabs-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'selected', 'value'],
  outputs: ['tabTriggerClick'],
})
export class MyTabsTrigger {
  protected el: HTMLMyTabsTriggerElement;
  @Output() tabTriggerClick = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyTabsTrigger extends Components.MyTabsTrigger {

  tabTriggerClick: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyToast,
  methods: ['present']
})
@Component({
  selector: 'my-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class MyToast {
  protected el: HTMLMyToastElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyToast extends Components.MyToast {}


@ProxyCmp({
  defineCustomElementFn: defineMyTooltip,
  inputs: ['closeDelay', 'content', 'openDelay', 'placement']
})
@Component({
  selector: 'my-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['closeDelay', 'content', 'openDelay', 'placement'],
})
export class MyTooltip {
  protected el: HTMLMyTooltipElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyTooltip extends Components.MyTooltip {}


