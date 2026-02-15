import { Routes } from '@angular/router';

const motionRoutes: Routes = [
  {
    path: '',
    redirectTo: 'fade',
    pathMatch: 'full',
  },
  {
    path: 'fade',
    loadComponent: () =>
      import('./pages/motion-demo/pages/fade-demo.component'),
  },
  {
    path: 'scale',
    loadComponent: () =>
      import('./pages/motion-demo/pages/scale-demo.component'),
  },
  {
    path: 'slide',
    loadComponent: () =>
      import('./pages/motion-demo/pages/slide-demo.component'),
  },
  {
    path: 'hover',
    loadComponent: () =>
      import('./pages/motion-demo/pages/hover-demo.component'),
  },
  {
    path: 'tap',
    loadComponent: () => import('./pages/motion-demo/pages/tap-demo.component'),
  },
  {
    path: 'custom',
    loadComponent: () =>
      import('./pages/motion-demo/pages/custom-demo.component'),
  },
  {
    path: 'stagger',
    loadComponent: () =>
      import('./pages/motion-demo/pages/stagger-demo.component'),
  },
  {
    path: 'attribute',
    loadComponent: () =>
      import('./pages/motion-demo/pages/attribute-demo.component'),
  },
];
export default motionRoutes;
