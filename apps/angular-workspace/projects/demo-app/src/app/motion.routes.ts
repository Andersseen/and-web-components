import { Routes } from '@angular/router';

const motionRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/motion-demo/pages/attribute-demo.component'),
  },
];
export default motionRoutes;
