import { Routes } from '@angular/router';

const behaviorsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/behaviors/behaviors-overview'),
  },
  {
    path: 'splitter',
    loadComponent: () => import('./pages/behaviors/splitter-demo'),
  },
  {
    path: 'drag-drop',
    loadComponent: () => import('./pages/behaviors/drag-drop-demo'),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./pages/behaviors/tooltip-demo'),
  },
  {
    path: 'dialog',
    loadComponent: () => import('./pages/behaviors/dialog-demo'),
  },
];
export default behaviorsRoutes;
