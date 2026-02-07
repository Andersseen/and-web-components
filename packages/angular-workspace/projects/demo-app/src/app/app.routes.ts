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
        loadChildren: () =>
          import('./pages/components/components.routes').then(
            (m) => m.COMPONENT_ROUTES,
          ),
      },
      {
        path: 'icons',
        loadComponent: () =>
          import('./pages/icons/icons-demo.component').then(
            (m) => m.IconsDemoComponent,
          ),
      },
    ],
  },
];
