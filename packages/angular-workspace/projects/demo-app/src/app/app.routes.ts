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
        path: 'headless',
        loadChildren: () => import('./headless.routes'),
      },
      {
        path: 'icons',
        loadComponent: () => import('./pages/icons/icons-demo.component'),
      },
      {
        path: 'motion',
        loadChildren: () => import('./motion.routes'),
      },
    ],
  },
];
