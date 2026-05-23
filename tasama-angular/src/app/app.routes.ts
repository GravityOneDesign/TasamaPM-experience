import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'pm',
    loadChildren: () =>
      import('./features/pm-console/pm-console.routes').then((m) => m.pmConsoleRoutes),
  },
  {
    path: 'executive',
    loadChildren: () =>
      import('./features/executive/executive.routes').then((m) => m.executiveRoutes),
  },
  {
    path: 'persona',
    loadChildren: () =>
      import('./features/persona/persona.routes').then((m) => m.personaRoutes),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
