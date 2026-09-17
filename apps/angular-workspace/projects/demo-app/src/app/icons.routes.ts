import { Routes } from '@angular/router';

const iconsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'gallery',
    pathMatch: 'full',
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/icons/icons-gallery-demo'),
  },
  {
    path: 'examples',
    loadComponent: () => import('./pages/icons/icons-examples-demo'),
  },
  {
    path: 'usage',
    loadComponent: () => import('./pages/icons/icons-usage-demo'),
  },
];

export default iconsRoutes;
