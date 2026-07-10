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
        loadChildren: () => import('./components.routes').then(m => m.default),
      },
      {
        path: 'headless',
        loadChildren: () => import('./headless.routes').then(m => m.default),
      },
      {
        path: 'icons',
        loadComponent: () => import('./pages/icons/icons-demo.component'),
      },
      {
        path: 'motion',
        loadChildren: () => import('./motion.routes').then(m => m.default),
      },
      {
        path: 'layout',
        loadChildren: () => import('./layout.routes').then(m => m.default),
      },
      {
        path: 'vanilla',
        loadChildren: () => import('./vanilla.routes').then(m => m.default),
      },
      {
        path: 'behaviors',
        loadChildren: () => import('./behaviors.routes').then(m => m.default),
      },
      {
        path: 'docs',
        loadComponent: () => import('./pages/docs/docs-ai.component'),
      },
    ],
  },
];
