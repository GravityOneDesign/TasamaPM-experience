import { Routes } from '@angular/router';

export const personaRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/placeholder/persona-flow-placeholder.component').then(
        (m) => m.PersonaFlowPlaceholderComponent,
      ),
  },
];
