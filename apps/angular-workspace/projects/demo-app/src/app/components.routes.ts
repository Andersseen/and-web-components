import { Routes } from '@angular/router';

const componentsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'accordion',
    pathMatch: 'full',
  },
  {
    path: 'accordion',
    loadComponent: () => import('./pages/components/accordion-demo'),
  },
  {
    path: 'alert',
    loadComponent: () => import('./pages/components/alert-demo'),
  },
  {
    path: 'badge',
    loadComponent: () => import('./pages/components/badge-demo'),
  },
  {
    path: 'button',
    loadComponent: () => import('./pages/components/button-demo'),
  },
  {
    path: 'card',
    loadComponent: () => import('./pages/components/card-demo'),
  },
  {
    path: 'carousel',
    loadComponent: () => import('./pages/components/carousel-demo'),
  },
  {
    path: 'drawer',
    loadComponent: () => import('./pages/components/drawer-demo'),
  },
  {
    path: 'dropdown',
    loadComponent: () => import('./pages/components/dropdown-demo'),
  },
  {
    path: 'input',
    loadComponent: () => import('./pages/components/input-demo'),
  },
  {
    path: 'modal',
    loadComponent: () => import('./pages/components/modal-demo'),
  },
  {
    path: 'navbar',
    loadComponent: () => import('./pages/components/navbar-demo'),
  },
  {
    path: 'pagination',
    loadComponent: () => import('./pages/components/pagination-demo'),
  },
  {
    path: 'sidebar',
    loadComponent: () => import('./pages/components/sidebar-demo'),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/components/tabs-demo'),
  },
  {
    path: 'toast',
    loadComponent: () => import('./pages/components/toast-demo'),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./pages/components/tooltip-demo'),
  },
];
export default componentsRoutes;
