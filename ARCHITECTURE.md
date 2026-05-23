# Tasama Angular — Scalable Architecture

**Branch:** `feat/scalable-architecture`
**Angular version:** 21.2.x (standalone components, OnPush by default)
**Build status:** ✅ Passes `npm run build` with zero errors

---

## What changed

The original codebase was a flat, designer-developed prototype — all components lived together in `src/app/` with no routing, no lazy loading, and no separation of concerns. This branch restructures it into a production-ready, feature-based architecture that can grow to support multiple roles and modules without accumulating technical debt.

---

## Folder structure

```
tasama-angular/
├── src/
│   ├── environments/
│   │   ├── environment.ts          ← development config
│   │   └── environment.prod.ts     ← production config (swapped by angular.json)
│   └── app/
│       ├── app.component.ts        ← thin root shell: <router-outlet /> only
│       ├── app.config.ts           ← ApplicationConfig: router, animations, http
│       ├── app.routes.ts           ← root lazy routes
│       │
│       ├── core/                   ← singleton services and global models
│       │   ├── services/
│       │   │   └── icon.service.ts
│       │   └── models/
│       │       └── persona-flow.config.ts
│       │
│       ├── shared/                 ← reusable UI with no business logic
│       │   └── components/
│       │       ├── ui/             ← atoms and molecules
│       │       │   ├── icon/
│       │       │   ├── status-pill/
│       │       │   ├── field/
│       │       │   ├── date-field/
│       │       │   ├── mode-tabs/
│       │       │   ├── toolbar/
│       │       │   ├── table-action/
│       │       │   ├── row-action-menu/
│       │       │   ├── register-table/
│       │       │   ├── work-calendar/
│       │       │   ├── risk-matrix/
│       │       │   ├── overview-cards/
│       │       │   └── ai-guide-chip/
│       │       ├── layout/         ← structural shells used across features
│       │       │   ├── top-bar/
│       │       │   └── side-nav/
│       │       └── agent/          ← AI agent UI layer
│       │           ├── agent-dock/
│       │           ├── agent-panel/
│       │           ├── agent-launcher/
│       │           ├── agent-orb/
│       │           ├── agent-banner/
│       │           ├── agent-message/
│       │           ├── agent-conversation/
│       │           └── agent-responder.service.ts
│       │
│       └── features/               ← one folder per role / domain
│           ├── auth/
│           │   ├── pages/
│           │   │   ├── login/
│           │   │   └── onboarding/
│           │   └── auth.routes.ts
│           │
│           ├── pm-console/
│           │   ├── models/
│           │   │   └── pm-console.types.ts
│           │   ├── components/     ← pm-console-specific organisms
│           │   │   ├── benefit-profile/
│           │   │   ├── risk-profile/
│           │   │   ├── project-profile-card/
│           │   │   ├── project-cover-cropper/
│           │   │   ├── project-dropdown/
│           │   │   ├── reporting-trends/
│           │   │   └── reporting-empty-illustration/
│           │   ├── pages/
│           │   │   ├── shell/        ← layout shell with top-bar + side-nav
│           │   │   ├── workspace/    ← main content area (was pm-console-content)
│           │   │   ├── plan/         ← plan table, plan drawer, empty state
│           │   │   ├── report/       ← report drawer
│           │   │   └── notifications/
│           │   └── pm-console.routes.ts
│           │
│           ├── executive/
│           │   ├── data/
│           │   │   ├── dashboard.data.ts
│           │   │   └── insights.data.ts
│           │   ├── components/
│           │   │   ├── stat-card/
│           │   │   ├── insight-card/
│           │   │   ├── bulletin-item/
│           │   │   ├── insights-dimension-list/
│           │   │   ├── insights-header/
│           │   │   ├── insights-kpi-row/
│           │   │   ├── insights-sidebar/
│           │   │   ├── insights-summary-card/
│           │   │   └── more-insights-panel/
│           │   ├── pages/
│           │   │   ├── dashboard/
│           │   │   └── insights/
│           │   └── executive.routes.ts
│           │
│           └── persona/
│               ├── pages/
│               │   └── placeholder/
│               └── persona.routes.ts
```

---

## Routing

All feature routes are **lazy-loaded**. The root router never eagerly imports a page component.

```
/                         → redirects to /auth/login

/auth/login               → LoginComponent           (lazy)
/auth/onboarding          → OnboardingComponent      (lazy)

/pm                       → PmConsoleShellComponent  (lazy, parent shell)
/pm/workspace             → WorkspaceComponent       (lazy, child route)

/executive/dashboard      → ExecutiveDashboardComponent  (lazy)
/executive/insights       → ExecutiveInsightsPageComponent (lazy)

/persona                  → PersonaFlowPlaceholderComponent (lazy)
```

**Route files:**

| File | Responsibility |
|------|---------------|
| `app/app.routes.ts` | Root routes — maps path prefixes to feature route files |
| `features/auth/auth.routes.ts` | Auth flow: login, onboarding |
| `features/pm-console/pm-console.routes.ts` | PM Console shell + workspace children |
| `features/executive/executive.routes.ts` | Dashboard and insights |
| `features/persona/persona.routes.ts` | Role placeholder pages |

---

## Application bootstrap

```
main.ts
  └── bootstrapApplication(AppComponent, appConfig)

app.config.ts
  ├── provideZoneChangeDetection({ eventCoalescing: true })
  ├── provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions())
  ├── provideAnimations()
  └── provideHttpClient(withInterceptorsFromDi())
```

The old `main.ts` passed a raw `providers` array inline. It now points to `appConfig`, which is the correct pattern for standalone Angular apps and makes per-environment provider overrides straightforward.

---

## Environments

```
src/environments/environment.ts       ← imported everywhere via the alias
src/environments/environment.prod.ts  ← swapped in by angular.json for production
```

`angular.json` file replacements:

```json
"production": {
  "fileReplacements": [
    { "replace": "src/environments/environment.ts",
      "with":    "src/environments/environment.prod.ts" }
  ]
}
```

Usage in any service:

```typescript
import { environment } from '../../../environments/environment';

const url = `${environment.apiBaseUrl}/projects`;
```

---

## Layer rules

### `core/`
- Singleton services (`providedIn: 'root'`) only.
- Global type definitions and configuration objects shared across all features.
- Never imports from `features/` or `shared/`.

### `shared/components/`
- Pure, reusable UI components with no knowledge of any business domain.
- Accepts typed `@Input()` / `@Output()` only — no service injection except `core/` services.
- Organised by atomic design level: `ui/` (atoms & molecules), `layout/` (structural), `agent/` (AI layer).
- Any component used in two or more features belongs here.

### `features/`
- One folder per role or domain (`auth`, `pm-console`, `executive`, `persona`).
- Each feature owns its own `pages/`, `components/`, `models/`, `services/`, `data/`, and a `*.routes.ts` file.
- Feature components may import from `shared/` and `core/`, never from another feature's internals.
- Seed or fixture data (`*.data.ts`) lives in the feature's `data/` folder, never inside a component class.

---

## Naming conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Component file | `kebab-name.component.ts` | `plan-drawer.component.ts` |
| Route file | `feature.routes.ts` | `pm-console.routes.ts` |
| Service file | `name.service.ts` | `icon.service.ts` |
| Model / types file | `name.types.ts` or `name.model.ts` | `pm-console.types.ts` |
| Data / fixture file | `name.data.ts` | `dashboard.data.ts` |
| Class name | PascalCase + role suffix | `PmConsoleShellComponent` |
| Selector | `app-` prefix | `app-pm-console-shell` |

---

## Angular standards applied

- **Standalone components** everywhere — no NgModule declarations.
- **`ChangeDetectionStrategy.OnPush`** on every component.
- **Strongly-typed `@Input()` / `@Output()`** — no `any` on public APIs.
- **`withComponentInputBinding()`** in the router — route parameters bind directly to `@Input()` properties without needing `ActivatedRoute` injection.
- **`withViewTransitions()`** in the router — page-level CSS view transitions enabled with no extra work.
- Angular schematics defaults in `angular.json` enforce `standalone: true`, `changeDetection: OnPush`, and `style: scss` for every generated component going forward.

---

## Adding a new role/feature

1. Create the feature folder:
   ```
   src/app/features/<role-name>/
   ├── pages/
   ├── components/
   ├── models/
   ├── services/
   └── <role-name>.routes.ts
   ```

2. Write the route file:
   ```typescript
   // features/pmo/pmo.routes.ts
   import { Routes } from '@angular/router';

   export const pmoRoutes: Routes = [
     {
       path: '',
       loadComponent: () =>
         import('./pages/shell/shell.component').then((m) => m.PmoShellComponent),
     },
   ];
   ```

3. Register the route in `app/app.routes.ts`:
   ```typescript
   {
     path: 'pmo',
     loadChildren: () =>
       import('./features/pmo/pmo.routes').then((m) => m.pmoRoutes),
   },
   ```

4. Navigate to `/pmo` — the chunk is loaded on demand.

---

## Adding a shared component

If a UI element will be used in two or more features, place it in `shared/components/`:

```
src/app/shared/components/ui/<component-name>/
└── <component-name>.component.ts
```

If it is specific to one feature, place it under that feature's `components/` folder.

---

## State management recommendation

The current feature set manages state locally inside the shell components (e.g., `PmConsoleShellComponent` owns selected page, project, and panel state). This is the right approach for a single-feature app.

When state needs to be shared **across features** (e.g., a logged-in user object used by both pm-console and executive), the recommended progression is:

1. **Angular Signals** (`signal()`, `computed()`, `effect()`) — available in Angular 16+, built-in, zero dependencies. Best for feature-level or cross-component reactive state.
2. **Service with signals** — a `UserService` with `readonly user = signal<User | null>(null)` covers most cross-feature needs without a full state library.
3. **NgRx Signal Store** (`@ngrx/signals`) — if the app grows to need action logging, time-travel debugging, or complex derived state across many features.

Do **not** add NgRx until the signals approach proves insufficient.

---

## API / service layer

An `HttpClient`-based service layer is ready to use — `provideHttpClient` is already registered in `app.config.ts`. The pattern to follow:

```
features/pm-console/services/
└── project.service.ts
```

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);

  getProjects() {
    return this.http.get(`${environment.apiBaseUrl}/projects`);
  }
}
```

---

## Build output (reference)

```
Initial chunk files  →  main.js, polyfills.js, styles.css  (~145 kB gzipped)

Lazy chunks (each loaded only when the route is visited):
  shell-component                    59.5 kB
  workspace-component + content      35 kB
  dashboard-component                24.5 kB
  login-component                     4.3 kB
  onboarding-component                3.1 kB
  persona-flow-placeholder-component  2.7 kB
  insights-page-component             164 B
  pm-console-routes / auth-routes / executive-routes / persona-routes  (tiny manifests)
```

Total build: zero TypeScript errors, zero template errors.
