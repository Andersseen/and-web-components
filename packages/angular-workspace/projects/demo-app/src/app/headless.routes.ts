import { Routes } from '@angular/router';

const headlessRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/headless/overview-demo'),
  },
  {
    path: 'button',
    loadComponent: () => import('./pages/headless/button-headless-demo'),
  },
  {
    path: 'dropdown',
    loadComponent: () => import('./pages/headless/dropdown-headless-demo'),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/headless/tabs-headless-demo'),
  },
  {
    path: 'accordion',
    loadComponent: () => import('./pages/headless/accordion-headless-demo'),
  },
  {
    path: 'modal',
    loadComponent: () => import('./pages/headless/modal-headless-demo'),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./pages/headless/tooltip-headless-demo'),
  },
  {
    path: 'toast',
    loadComponent: () => import('./pages/headless/toast-headless-demo'),
  },
  {
    path: 'drawer',
    loadComponent: () => import('./pages/headless/drawer-headless-demo'),
  },
  {
    path: 'alert',
    loadComponent: () => import('./pages/headless/alert-headless-demo'),
  },
];

export default headlessRoutes;
