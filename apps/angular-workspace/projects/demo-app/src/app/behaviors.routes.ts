import { Routes } from '@angular/router';

const behaviorsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/behaviors/behaviors-overview.component'),
  },
  {
    path: 'splitter',
    loadComponent: () => import('./pages/behaviors/splitter-demo.component'),
  },
  {
    path: 'drag-drop',
    loadComponent: () => import('./pages/behaviors/drag-drop-demo.component'),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./pages/behaviors/tooltip-demo.component'),
  },
  {
    path: 'dialog',
    loadComponent: () => import('./pages/behaviors/dialog-demo.component'),
  },
];
export default behaviorsRoutes;
