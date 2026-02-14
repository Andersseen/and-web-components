import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'components',
        pathMatch: 'full',
      },
      {
        path: 'components',
        loadChildren: () => import('./components.routes'),
      },
      {
        path: 'icons',
        loadComponent: () => import('./pages/icons/icons-demo.component'),
      },
      {
        path: 'motion',
        loadComponent: () => import('./pages/motion-demo/motion-demo.component'),
      },
    ],
  },
];
