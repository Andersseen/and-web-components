import { Routes } from '@angular/router';

export const COMPONENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'accordion',
    pathMatch: 'full',
  },
  {
    path: 'accordion',
    loadComponent: () =>
      import('./accordion-demo.component').then(
        (m) => m.AccordionDemoComponent,
      ),
  },
  {
    path: 'alert',
    loadComponent: () =>
      import('./alert-demo.component').then((m) => m.AlertDemoComponent),
  },
  {
    path: 'badge',
    loadComponent: () =>
      import('./badge-demo.component').then((m) => m.BadgeDemoComponent),
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./button-demo.component').then((m) => m.ButtonDemoComponent),
  },
  {
    path: 'card',
    loadComponent: () =>
      import('./card-demo.component').then((m) => m.CardDemoComponent),
  },
  {
    path: 'carousel',
    loadComponent: () =>
      import('./carousel-demo.component').then((m) => m.CarouselDemoComponent),
  },
  {
    path: 'drawer',
    loadComponent: () =>
      import('./drawer-demo.component').then((m) => m.DrawerDemoComponent),
  },
  {
    path: 'dropdown',
    loadComponent: () =>
      import('./dropdown-demo.component').then((m) => m.DropdownDemoComponent),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('./input-demo.component').then((m) => m.InputDemoComponent),
  },
  {
    path: 'modal',
    loadComponent: () =>
      import('./modal-demo.component').then((m) => m.ModalDemoComponent),
  },
  {
    path: 'navbar',
    loadComponent: () =>
      import('./navbar-demo.component').then((m) => m.NavbarDemoComponent),
  },
  {
    path: 'pagination',
    loadComponent: () =>
      import('./pagination-demo.component').then(
        (m) => m.PaginationDemoComponent,
      ),
  },
  {
    path: 'sidebar',
    loadComponent: () =>
      import('./sidebar-demo.component').then((m) => m.SidebarDemoComponent),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs-demo.component').then((m) => m.TabsDemoComponent),
  },
  {
    path: 'toast',
    loadComponent: () =>
      import('./toast-demo.component').then((m) => m.ToastDemoComponent),
  },
  {
    path: 'tooltip',
    loadComponent: () =>
      import('./tooltip-demo.component').then((m) => m.TooltipDemoComponent),
  },
];
