import { Routes } from '@angular/router';

export const pmConsoleRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/shell/shell.component').then((m) => m.PmConsoleShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'workspace',
        pathMatch: 'full',
      },
      {
        path: 'workspace',
        loadComponent: () =>
          import('./pages/workspace/workspace.component').then((m) => m.PmConsoleContentComponent),
      },
      {
        path: 'workspaces',
        loadComponent: () =>
          import('./pages/workspace/workspace.component').then((m) => m.PmConsoleContentComponent),
      },
    ],
  },
];
