import { Routes } from '@angular/router';

export const executiveRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.ExecutiveDashboardComponent),
  },
  {
    path: 'insights',
    loadComponent: () =>
      import('./pages/insights/insights-page.component').then((m) => m.ExecutiveInsightsPageComponent),
  },
];
