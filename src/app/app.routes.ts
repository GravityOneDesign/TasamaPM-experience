import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'pm',
    pathMatch: 'full',
  },
  {
    path: 'login',
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
    canMatch: [authGuard],
    loadChildren: () =>
      import('./features/pm-console/pm-console.routes').then((m) => m.pmConsoleRoutes),
  },
  {
    path: 'executive',
    canMatch: [authGuard],
    loadChildren: () =>
      import('./features/executive/executive.routes').then((m) => m.executiveRoutes),
  },
  {
    path: 'persona',
    canMatch: [authGuard],
    loadChildren: () =>
      import('./features/persona/persona.routes').then((m) => m.personaRoutes),
  },
  {
    path: '**',
    redirectTo: 'pm',
  },
];
