/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@andersseen/web-components/components';

import { defineCustomElement as defineAndAccordion } from '@andersseen/web-components/components/and-accordion.js';
import { defineCustomElement as defineAndAccordionContent } from '@andersseen/web-components/components/and-accordion-content.js';
import { defineCustomElement as defineAndAccordionItem } from '@andersseen/web-components/components/and-accordion-item.js';
import { defineCustomElement as defineAndAccordionTrigger } from '@andersseen/web-components/components/and-accordion-trigger.js';
import { defineCustomElement as defineAndAlert } from '@andersseen/web-components/components/and-alert.js';
import { defineCustomElement as defineAndBadge } from '@andersseen/web-components/components/and-badge.js';
import { defineCustomElement as defineAndBreadcrumb } from '@andersseen/web-components/components/and-breadcrumb.js';
import { defineCustomElement as defineAndBreadcrumbItem } from '@andersseen/web-components/components/and-breadcrumb-item.js';
import { defineCustomElement as defineAndButton } from '@andersseen/web-components/components/and-button.js';
import { defineCustomElement as defineAndCard } from '@andersseen/web-components/components/and-card.js';
import { defineCustomElement as defineAndCarousel } from '@andersseen/web-components/components/and-carousel.js';
import { defineCustomElement as defineAndCarouselItem } from '@andersseen/web-components/components/and-carousel-item.js';
import { defineCustomElement as defineAndContextMenu } from '@andersseen/web-components/components/and-context-menu.js';
import { defineCustomElement as defineAndDrawer } from '@andersseen/web-components/components/and-drawer.js';
import { defineCustomElement as defineAndDropdown } from '@andersseen/web-components/components/and-dropdown.js';
import { defineCustomElement as defineAndIcon } from '@andersseen/web-components/components/and-icon.js';
import { defineCustomElement as defineAndInput } from '@andersseen/web-components/components/and-input.js';
import { defineCustomElement as defineAndMenuItem } from '@andersseen/web-components/components/and-menu-item.js';
import { defineCustomElement as defineAndMenuList } from '@andersseen/web-components/components/and-menu-list.js';
import { defineCustomElement as defineAndModal } from '@andersseen/web-components/components/and-modal.js';
import { defineCustomElement as defineAndNavbar } from '@andersseen/web-components/components/and-navbar.js';
import { defineCustomElement as defineAndPagination } from '@andersseen/web-components/components/and-pagination.js';
import { defineCustomElement as defineAndSidebar } from '@andersseen/web-components/components/and-sidebar.js';
import { defineCustomElement as defineAndTabs } from '@andersseen/web-components/components/and-tabs.js';
import { defineCustomElement as defineAndTabsContent } from '@andersseen/web-components/components/and-tabs-content.js';
import { defineCustomElement as defineAndTabsList } from '@andersseen/web-components/components/and-tabs-list.js';
import { defineCustomElement as defineAndTabsTrigger } from '@andersseen/web-components/components/and-tabs-trigger.js';
import { defineCustomElement as defineAndToast } from '@andersseen/web-components/components/and-toast.js';
import { defineCustomElement as defineAndTooltip } from '@andersseen/web-components/components/and-tooltip.js';
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
  outputs: ['andDismiss'],
})
export class AndAlert {
  protected el: HTMLAndAlertElement;
  @Output() andDismiss = new EventEmitter<CustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndAlert extends Components.AndAlert {
  /**
   * Emitted when the alert is dismissed.
   */
  andDismiss: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndBadge,
  inputs: ['customClass', 'variant']
})
@Component({
  selector: 'and-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['customClass', 'variant'],
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
  defineCustomElementFn: defineAndBreadcrumb,
  inputs: ['customClass', 'navLabel', 'size']
})
@Component({
  selector: 'and-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['customClass', 'navLabel', 'size'],
})
export class AndBreadcrumb {
  protected el: HTMLAndBreadcrumbElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndBreadcrumb extends Components.AndBreadcrumb {}


@ProxyCmp({
  defineCustomElementFn: defineAndBreadcrumbItem,
  inputs: ['current', 'customClass', 'hideSeparator', 'href', 'size']
})
@Component({
  selector: 'and-breadcrumb-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['current', 'customClass', 'hideSeparator', 'href', 'size'],
  outputs: ['andBreadcrumbNavigate'],
})
export class AndBreadcrumbItem {
  protected el: HTMLAndBreadcrumbItemElement;
  @Output() andBreadcrumbNavigate = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndBreadcrumbItem extends Components.AndBreadcrumbItem {
  /**
   * Emitted when a breadcrumb link is activated.
   */
  andBreadcrumbNavigate: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndButton,
  inputs: ['customClass', 'disabled', 'href', 'loading', 'rel', 'size', 'target', 'type', 'variant']
})
@Component({
  selector: 'and-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['customClass', 'disabled', 'href', 'loading', 'rel', 'size', 'target', 'type', 'variant'],
  outputs: ['andButtonClick'],
})
export class AndButton {
  protected el: HTMLAndButtonElement;
  @Output() andButtonClick = new EventEmitter<CustomEvent<MouseEvent>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndButton extends Components.AndButton {
  /**
   * Emitted on button click.
   */
  andButtonClick: EventEmitter<CustomEvent<MouseEvent>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndCard,
  inputs: ['customClass', 'variant']
})
@Component({
  selector: 'and-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['customClass', 'variant'],
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
  inputs: ['autoplay', 'interval', 'label']
})
@Component({
  selector: 'and-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['autoplay', 'interval', 'label'],
  outputs: ['andSlideChange'],
})
export class AndCarousel {
  protected el: HTMLAndCarouselElement;
  @Output() andSlideChange = new EventEmitter<CustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndCarousel extends Components.AndCarousel {
  /**
   * Emitted when the active slide changes.
   */
  andSlideChange: EventEmitter<CustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndCarouselItem,
  inputs: ['label']
})
@Component({
  selector: 'and-carousel-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label'],
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
  defineCustomElementFn: defineAndContextMenu,
  inputs: ['customClass', 'open']
})
@Component({
  selector: 'and-context-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['customClass', 'open'],
  outputs: ['andContextMenuOpenChange'],
})
export class AndContextMenu {
  protected el: HTMLAndContextMenuElement;
  @Output() andContextMenuOpenChange = new EventEmitter<CustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndContextMenu extends Components.AndContextMenu {
  /**
   * Emitted when the open state changes.
   */
  andContextMenuOpenChange: EventEmitter<CustomEvent<boolean>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndDrawer,
  inputs: ['open', 'placement', 'showClose']
})
@Component({
  selector: 'and-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['open', 'placement', 'showClose'],
  outputs: ['andDrawerClose', 'andDrawerOpen'],
})
export class AndDrawer {
  protected el: HTMLAndDrawerElement;
  @Output() andDrawerClose = new EventEmitter<CustomEvent<void>>();
  @Output() andDrawerOpen = new EventEmitter<CustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndDrawer extends Components.AndDrawer {
  /**
   * Emitted when the drawer is closed (backdrop click, close button, or Escape).
   */
  andDrawerClose: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the drawer is opened.
   */
  andDrawerOpen: EventEmitter<CustomEvent<void>>;
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
  outputs: ['andDropdownSelect', 'andDropdownOpenChange'],
})
export class AndDropdown {
  protected el: HTMLAndDropdownElement;
  @Output() andDropdownSelect = new EventEmitter<CustomEvent<string>>();
  @Output() andDropdownOpenChange = new EventEmitter<CustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndDropdown extends Components.AndDropdown {
  /**
   * Emitted when an item is selected.
   */
  andDropdownSelect: EventEmitter<CustomEvent<string>>;
  /**
   * Emitted when the dropdown open state changes.
   */
  andDropdownOpenChange: EventEmitter<CustomEvent<boolean>>;
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
  inputs: ['customClass', 'describedBy', 'disabled', 'hasError', 'label', 'placeholder', 'required', 'type', 'value']
})
@Component({
  selector: 'and-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['customClass', 'describedBy', 'disabled', 'hasError', 'label', 'placeholder', 'required', 'type', 'value'],
  outputs: ['andInput', 'andBlur'],
})
export class AndInput {
  protected el: HTMLAndInputElement;
  @Output() andInput = new EventEmitter<CustomEvent<string>>();
  @Output() andBlur = new EventEmitter<CustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndInput extends Components.AndInput {
  /**
   * Emitted when the input value changes.
   */
  andInput: EventEmitter<CustomEvent<string>>;
  /**
   * Emitted when the input loses focus.
   */
  andBlur: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndMenuItem,
  inputs: ['customClass', 'disabled', 'intent', 'value']
})
@Component({
  selector: 'and-menu-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['customClass', 'disabled', 'intent', 'value'],
  outputs: ['andMenuItemSelect'],
})
export class AndMenuItem {
  protected el: HTMLAndMenuItemElement;
  @Output() andMenuItemSelect = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndMenuItem extends Components.AndMenuItem {
  /**
   * Emitted when the item is selected (clicked or Enter/Space pressed).
   */
  andMenuItemSelect: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndMenuList,
  inputs: ['ariaMenuLabel', 'customClass']
})
@Component({
  selector: 'and-menu-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['ariaMenuLabel', 'customClass'],
})
export class AndMenuList {
  protected el: HTMLAndMenuListElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndMenuList extends Components.AndMenuList {}


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
  outputs: ['andClose'],
})
export class AndModal {
  protected el: HTMLAndModalElement;
  @Output() andClose = new EventEmitter<CustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndModal extends Components.AndModal {
  /**
   * Emitted when the modal is closed.
   */
  andClose: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndNavbar,
  inputs: ['activeItem', 'ariaNavLabel', 'autoCollapse', 'compactBreakpoint', 'items', 'minimalBreakpoint', 'mobileBreakpoint', 'position', 'scrollSpy', 'scrollSpyOffset', 'variant']
})
@Component({
  selector: 'and-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activeItem', 'ariaNavLabel', 'autoCollapse', 'compactBreakpoint', 'items', 'minimalBreakpoint', 'mobileBreakpoint', 'position', 'scrollSpy', 'scrollSpyOffset', 'variant'],
  outputs: ['navItemClick', 'navLinkClick', 'mobileMenuChange', 'responsiveStageChange'],
})
export class AndNavbar {
  protected el: HTMLAndNavbarElement;
  @Output() navItemClick = new EventEmitter<CustomEvent<string>>();
  @Output() navLinkClick = new EventEmitter<CustomEvent<{ id: string; href: string }>>();
  @Output() mobileMenuChange = new EventEmitter<CustomEvent<boolean>>();
  @Output() responsiveStageChange = new EventEmitter<CustomEvent<IAndNavbarResponsiveStage>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { ResponsiveStage as IAndNavbarResponsiveStage } from '@andersseen/web-components/components';

export declare interface AndNavbar extends Components.AndNavbar {
  /**
   * Emitted when active item changes
   */
  navItemClick: EventEmitter<CustomEvent<string>>;
  /**
   * Emitted when a navigation link is clicked
   */
  navLinkClick: EventEmitter<CustomEvent<{ id: string; href: string }>>;
  /**
   * Emitted when mobile menu state changes
   */
  mobileMenuChange: EventEmitter<CustomEvent<boolean>>;
  /**
   * Emitted when responsive stage changes
   */
  responsiveStageChange: EventEmitter<CustomEvent<IAndNavbarResponsiveStage>>;
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
  outputs: ['andPageChange'],
})
export class AndPagination {
  protected el: HTMLAndPaginationElement;
  @Output() andPageChange = new EventEmitter<CustomEvent<number>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndPagination extends Components.AndPagination {
  /**
   * Emitted when the page changes.
   */
  andPageChange: EventEmitter<CustomEvent<number>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAndSidebar,
  inputs: ['activeItem', 'ariaNavLabel', 'collapsed', 'collapsedWidth', 'expandedWidth', 'items', 'mobileBreakpoint', 'mobileCollapse', 'variant']
})
@Component({
  selector: 'and-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activeItem', 'ariaNavLabel', 'collapsed', 'collapsedWidth', 'expandedWidth', 'items', 'mobileBreakpoint', 'mobileCollapse', 'variant'],
  outputs: ['andSidebarItemClick', 'andSidebarToggle'],
})
export class AndSidebar {
  protected el: HTMLAndSidebarElement;
  @Output() andSidebarItemClick = new EventEmitter<CustomEvent<string>>();
  @Output() andSidebarToggle = new EventEmitter<CustomEvent<boolean>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndSidebar extends Components.AndSidebar {
  /**
   * Emitted when a navigation item is clicked.
   */
  andSidebarItemClick: EventEmitter<CustomEvent<string>>;
  /**
   * Emitted when the sidebar collapse state changes.
   */
  andSidebarToggle: EventEmitter<CustomEvent<boolean>>;
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
  outputs: ['andTabChange'],
})
export class AndTabs {
  protected el: HTMLAndTabsElement;
  @Output() andTabChange = new EventEmitter<CustomEvent<string>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AndTabs extends Components.AndTabs {
  /**
   * Emitted when the selected tab changes.
   */
  andTabChange: EventEmitter<CustomEvent<string>>;
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
  /**
   * Emitted when this trigger is clicked.
   */
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


