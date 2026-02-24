import { Routes } from '@angular/router';

const motionRoutes: Routes = [
  {
    path: '',
    redirectTo: 'attribute',
    pathMatch: 'full',
  },
  {
    path: 'attribute',
    loadComponent: () =>
      import('./pages/motion-demo/pages/attribute-demo.component'),
  },
  {
    path: 'attention-seekers',
    loadComponent: () =>
      import('./pages/motion-demo/pages/attention-seekers-demo.component'),
  },
  {
    path: 'fading',
    loadComponent: () =>
      import('./pages/motion-demo/pages/fading-demo.component'),
  },
  {
    path: 'sliding',
    loadComponent: () =>
      import('./pages/motion-demo/pages/sliding-demo.component'),
  },
  {
    path: 'zooming',
    loadComponent: () =>
      import('./pages/motion-demo/pages/zooming-demo.component'),
  },
  {
    path: 'bouncing',
    loadComponent: () =>
      import('./pages/motion-demo/pages/bouncing-demo.component'),
  },
  {
    path: 'flippers',
    loadComponent: () =>
      import('./pages/motion-demo/pages/flippers-demo.component'),
  },
  {
    path: 'rotating',
    loadComponent: () =>
      import('./pages/motion-demo/pages/rotating-demo.component'),
  },
  {
    path: 'lightspeed',
    loadComponent: () =>
      import('./pages/motion-demo/pages/lightspeed-demo.component'),
  },
  {
    path: 'back',
    loadComponent: () =>
      import('./pages/motion-demo/pages/back-demo.component'),
  },
  {
    path: 'specials',
    loadComponent: () =>
      import('./pages/motion-demo/pages/specials-demo.component'),
  },
];
export default motionRoutes;
