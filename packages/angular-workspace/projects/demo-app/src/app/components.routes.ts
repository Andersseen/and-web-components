import { Routes } from '@angular/router';

const componentsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'accordion',
    pathMatch: 'full',
  },
  {
    path: 'accordion',
    loadComponent: () => import('./pages/components/accordion-demo.component'),
  },
  {
    path: 'alert',
    loadComponent: () => import('./pages/components/alert-demo.component'),
  },
  {
    path: 'badge',
    loadComponent: () => import('./pages/components/badge-demo.component'),
  },
  {
    path: 'button',
    loadComponent: () => import('./pages/components/button-demo.component'),
  },
  {
    path: 'card',
    loadComponent: () => import('./pages/components/card-demo.component'),
  },
  {
    path: 'carousel',
    loadComponent: () => import('./pages/components/carousel-demo.component'),
  },
  {
    path: 'drawer',
    loadComponent: () => import('./pages/components/drawer-demo.component'),
  },
  {
    path: 'dropdown',
    loadComponent: () => import('./pages/components/dropdown-demo.component'),
  },
  {
    path: 'input',
    loadComponent: () => import('./pages/components/input-demo.component'),
  },
  {
    path: 'modal',
    loadComponent: () => import('./pages/components/modal-demo.component'),
  },
  // {
  //   path: 'navbar',
  //   loadComponent: () => import('./pages/components/navbar-demo.component'),
  // },
  {
    path: 'pagination',
    loadComponent: () => import('./pages/components/pagination-demo.component'),
  },
  // {
  //   path: 'sidebar',
  //   loadComponent: () => import('./pages/components/sidebar-demo.component'),
  // },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/components/tabs-demo.component'),
  },
  {
    path: 'toast',
    loadComponent: () => import('./pages/components/toast-demo.component'),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./pages/components/tooltip-demo.component'),
  },
];
export default componentsRoutes;
