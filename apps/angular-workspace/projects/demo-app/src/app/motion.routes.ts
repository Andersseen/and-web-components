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
];
export default motionRoutes;
