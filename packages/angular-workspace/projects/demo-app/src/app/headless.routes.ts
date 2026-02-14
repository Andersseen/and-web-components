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
];

export default headlessRoutes;
