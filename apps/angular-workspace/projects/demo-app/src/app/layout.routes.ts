import { Routes } from '@angular/router';

const layoutRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/layout/layout-overview-demo'),
  },
  {
    path: 'flex',
    loadComponent: () => import('./pages/layout/layout-flex-demo'),
  },
  {
    path: 'grid',
    loadComponent: () => import('./pages/layout/layout-grid-demo'),
  },
  {
    path: 'spacing',
    loadComponent: () => import('./pages/layout/layout-spacing-demo'),
  },
  {
    path: 'typography',
    loadComponent: () => import('./pages/layout/layout-typography-demo'),
  },
  {
    path: 'responsive',
    loadComponent: () => import('./pages/layout/layout-responsive-demo'),
  },
];

export default layoutRoutes;
