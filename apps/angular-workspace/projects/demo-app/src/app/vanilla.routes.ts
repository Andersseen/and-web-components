import { Routes } from '@angular/router';

const vanillaRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/vanilla/vanilla-overview.component'),
  },
  {
    path: 'button',
    loadComponent: () => import('./pages/vanilla/vanilla-button-demo.component'),
  },
  {
    path: 'modal',
    loadComponent: () => import('./pages/vanilla/vanilla-modal-demo.component'),
  },
  {
    path: 'accordion',
    loadComponent: () => import('./pages/vanilla/vanilla-accordion-demo.component'),
  },
];
export default vanillaRoutes;
