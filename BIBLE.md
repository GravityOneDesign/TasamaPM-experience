# Tasama Project Bible

Last updated: 2026-05-25

This file is the long-term handoff, memory, architecture guide, and AI-agent operating manual for the Tasama project. It exists so another coding agent, developer, or design engineer can restart work in a different tool and still understand the project language, product context, structure, and constraints.

Always read this file together with `AGENTS.md`. `AGENTS.md` contains the hard working rules. This file contains the fuller project memory and blueprint.

## Non-Negotiable Update Rule

This is a living document. Any agent or developer making a meaningful change must update this file in the same change set.

Update `BIBLE.md` when any of these change:

- Product meaning, persona behavior, navigation, route or mount logic.
- Architecture, folder structure, ownership boundaries, shared component strategy, services, fixtures, or data placement.
- UI patterns, design system rules, tokens, icons, spacing, typography, or Figma interpretation.
- PM front door, onboarding, PM 101, executive, PMO, program, portfolio, or project manager workflows.
- New reusable components, extracted feature components, shared utilities, or data fixtures.
- Known issues, refactor plan, setup commands, build commands, deployment workflow, or verification expectations.

For tiny edits that do not affect project memory, such as fixing a typo in a button label, a Bible update may be unnecessary. When unsure, update the relevant section and add a short Memory Log entry.

## Project Identity

Tasama is an Angular-based project, portfolio, and executive execution workspace. The product goal is to become a structured, optimized, production-ready Angular codebase that matches supplied Figma designs closely while staying easy to extend.

The product currently focuses on:

- Project Manager front-door and PM console workflows.
- PM onboarding and PM 101 flows.
- Project plan, reporting, stage gate, risk, benefit, dependency, issue, resource, change request, and closure workflows.
- An Executive front door and executive insights deep dive.
- Persona selection at login for Project Manager, Program Manager, Executive, PMO, and Portfolio Manager.

Core product principle: each persona must have a clear root entry point and ownership boundary. Do not hide one persona inside another persona's dashboard, front door, page switch, or state machine unless the product design explicitly calls for a shared experience.

## Repository Map

```text
.
  AGENTS.md
  BIBLE.md
  README.md
  docs/
    componentization-audit.md
    tasama-design-system.md
  tokens/
    tasama.tokens.json
    tasama.css
  pm-frontdoor/
    index.html
    app.js
    styles.css
    pm-console-standalone.html
    tasama-pm-console-single.html
    assets/
  tasama-angular/
    angular.json
    package.json
    package-lock.json
    tsconfig.json
    src/
      main.ts
      index.html
      styles.css
      assets/
      app/
        app.component.ts
        persona-flow.config.ts
        persona-flow-placeholder.component.ts
        pm-console-*.ts
        shared/
        executive/
  .github/
    workflows/main.yml
  .codex/
    environments/environment.toml
```

Important interpretation:

- `tasama-angular` is the active Angular application.
- `pm-frontdoor` is a static prototype/reference. Treat it as design memory, not the production architecture.
- `tokens` and `docs/tasama-design-system.md` are the design system references.
- `docs/componentization-audit.md` records the known componentization problem and target direction.

## Technology Stack

- Angular 21 standalone components.
- No NgModules in the app code.
- Strict TypeScript and strict Angular templates.
- `ChangeDetectionStrategy.OnPush` is used across the component set.
- RxJS is installed but the current app is mostly component state and event emitters.
- Lucide icons are loaded from `src/assets/lucide.min.js` through `PmConsoleIconService` and rendered through the `pmConsoleIcon` wrapper/directive pattern.
- The app currently does not use Angular Router. `AppComponent` switches views manually.

Commands:

```bash
cd tasama-angular
npm install --legacy-peer-deps
npm run start
npm run build
```

`npm run start` maps to `ng serve --host 127.0.0.1`. `npm run build` maps to `ng build`.

The current GitHub Action uses Node 20, runs `npm install --legacy-peer-deps`, builds Angular, then deploys `tasama-angular/dist/tasama-angular/browser` to Azure Web App `sdz-tasama-pm-ui`.

## Application Boot And Entry Flow

The Angular app boots from `tasama-angular/src/main.ts`:

- `bootstrapApplication(AppComponent, { providers: [provideAnimations()] })`.

The root component is `tasama-angular/src/app/app.component.ts`. It owns the top-level view state:

- `login`
- `onboarding`
- `console`
- `persona`
- `executive`

Top-level flow:

- Default view is login.
- Login emits a selected persona id.
- Project Manager mounts the PM console shell directly.
- Executive mounts the Executive root directly.
- Program Manager, PMO, and Portfolio Manager currently mount a placeholder shell.
- The onboarding screen can mount PM console in guided-tour or PMO-assignment states.

There is no URL route map yet. If routing is introduced later, preserve persona ownership by routing each persona to its own root shell rather than wiring new persona screens through the PM console content component.

## Login And Persona Selection

Files:

- `tasama-angular/src/app/pm-console-login.component.ts`
- `tasama-angular/src/app/persona-flow.config.ts`
- `tasama-angular/src/app/persona-flow-placeholder.component.ts`
- `tasama-angular/src/app/app.component.ts`

Login details:

- Persona options come from `personaFlowOptions`.
- The temporary prototype password is `123`.
- On wrong password, the password input is focused and no route/mount happens.
- Clicking the Tasama logo on login starts onboarding.

Persona ids:

- `project-manager`
- `program-manager`
- `executive`
- `pmo`
- `portfolio-manager`

Current persona states:

- Project Manager has a real PM console entry.
- Executive has a dedicated root experience in `src/app/executive`.
- Program Manager, PMO, and Portfolio Manager are placeholders and should receive persona-owned shells/folders when implemented.

## Persona Ownership Rules

Project Manager:

- Owns the PM console shell and PM front door.
- Current root component is `PmConsoleShellComponent`.
- Most PM workflow content is still in `PmConsoleContentComponent`.

Executive:

- Owns `tasama-angular/src/app/executive`.
- Current root component is `ExecutiveDashboardComponent`.
- Must not be built inside PM console content.

Program Manager:

- Currently a placeholder.
- Future implementation should use its own folder, root shell, data, and components unless something is intentionally shared.

PMO:

- Currently a placeholder.
- PMO concepts already appear in PM onboarding and assignment flows, but the PMO persona itself must not be implemented as a page mode inside the PM console.

Portfolio Manager:

- Currently a placeholder.
- Future implementation should get its own shell and folder. Reuse shared tables/cards/toolbars where appropriate, but do not mount portfolio workflows inside PM-only front-door switches.

## Glossary

PM front door:

- The PM console home/PM101 operational landing area, not the login page.
- In normal flow it is `selectedPage = 'workspace'`, usually `selectedView = 'pm101'`, with `frontDoorMode = 'assigned'`.
- It includes the project switcher, overview hero, journey/action cards, manage-my-work tabs, quick links, and right-side digest/reporting trends.

PM console:

- The Project Manager workspace mounted by `PmConsoleShellComponent`.
- It contains top bar, left rail, content area, notifications panel, and agent dock.

PM 101:

- The PM onboarding/front-door view inside the workspace area.
- It presents the project management journey and later selected-project quick links.

PM 101 locked:

- Onboarding state before the first PMO assignment is available.
- `onboardingPm101Locked = true`.
- Selected project is forced to `all`.
- Many rail items, quick links, and workspace actions are locked until PMO assignment.

PMO assignment ready:

- A state where the first assignment is available.
- `pmoAssignmentReady = true`.
- The first assigned project is `UAE Research Map`.

First assigned project:

- Id/name: `UAE Research Map`
- Stage: `Initiation`
- Owner: `Muna Hassan`
- Plan due: `Jun 12`

Unassigned front door:

- State where the PM has no assigned project yet.
- `frontDoorMode = 'unassigned'`.
- Shows no-project messaging and PMO assignment simulation.

Assigned front door:

- State where the PM has an assigned project and can move into project setup, PM101, work management, and project workspace areas.

Operational workspace:

- The PM workspace surface for calendar, board, PM101 overview, stages, and quick links.

Project room:

- A project-scoped workspace entered from workspace/register or quick links. Current implementation maps many project-room actions to `project-plan`, `wbs`, or `workspaces` states.

Register:

- A table-style area for project, risk, or benefit records.

Project plan:

- The PM planning workspace with `quick`, `reports`, `stages`, `change-request`, and `closure` entries.

PSR:

- Project Status Report. Report creation and preview are handled in the report drawer and project-plan report flows.

## PM Console Architecture

Primary files:

- `tasama-angular/src/app/pm-console-shell.component.ts`
- `tasama-angular/src/app/pm-console-content.component.ts`
- `tasama-angular/src/app/pm-console.types.ts`
- `tasama-angular/src/app/pm-console-login.component.ts`
- `tasama-angular/src/app/pm-console-onboarding.component.ts`
- `tasama-angular/src/app/pm-console-notifications.component.ts`
- `tasama-angular/src/app/pm-console-plan-drawer.component.ts`
- `tasama-angular/src/app/pm-console-plan-empty-state.component.ts`
- `tasama-angular/src/app/pm-console-plan-table.component.ts`
- `tasama-angular/src/app/pm-console-report-drawer.component.ts`

`PmConsoleShellComponent` responsibilities:

- Owns high-level PM console state passed from `AppComponent`.
- Renders top bar, side nav, content, notifications, and agent dock.
- Holds project options.
- Owns rail navigation.
- Passes PM state into `PmConsoleContentComponent`.
- Receives `consoleStateChange` from content and applies state back to the shell.

PM shell state:

- `selectedProject`
- `selectedPage`
- `selectedView`
- `frontDoorMode`
- `notificationPanelOpen`
- `pmoAssignmentReady`
- `guidedTourActive`
- `guidedTourExitMode`
- `onboardingAssignmentFlow`
- `onboardingPm101Locked`
- `onboardingProjectSetup`
- `sideNavExpanded`

Shell page types:

- `workspace`
- `workspaces`
- `wbs`
- `project-plan`
- `playground`

Workspace view types:

- `calendar`
- `board`
- `pm101`
- `stages`
- `quicklinks`

Rail items:

- Home: `workspace`, home behavior.
- My Workspace: `workspaces`.
- Dashboards: currently disabled, points to workspace board when enabled.
- Help and Settings: utility items, currently not deep experiences.

`PmConsoleContentComponent` responsibilities:

- This is currently the main PM console monolith.
- It contains the PM content template, workspace views, project plan views, registers, drawers, state transitions, data seeds, table schemas, formatting helpers, report logic, AI assist simulations, and local UI persistence.
- It is the primary refactor target. Do not expand it casually.

Current size note:

- `pm-console-content.component.ts` is about 19,000 lines.
- It should be reduced over time by extracting typed data/config, feature components, and shared organisms.

## PM Console State Model

Important types in `PmConsoleContentComponent`:

- `ConsolePage = 'workspace' | 'workspaces' | 'wbs' | 'project-plan' | 'playground'`
- `WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages' | 'quicklinks'`
- `ActionWorkspaceView = 'board' | 'calendar'`
- `Pm101OverviewMode = 'journey' | 'quicklinks'`
- `WorkspaceRegister = 'projects' | 'benefits' | 'risks'`
- `ProjectPlanEntry = 'quick' | 'reports' | 'stages' | 'change-request' | 'closure'`
- `ProjectPlanDetailMode = 'simple' | 'detailed'`
- `ReportDetailMode = 'simple' | 'detailed'`
- `ReportDrawerPresentationMode = 'compose' | 'pdf-preview'`
- `RiskProfileTab = 'identification' | 'analysis' | 'treatment'`

Mount options are defined in `pm-console.types.ts`:

- `authenticated`
- `projectId`
- `selectedPage`
- `selectedView`
- `frontDoorMode`
- `guidedTourActive`
- `guidedTourExitMode`
- `onboardingAssignmentFlow`
- `onboardingPm101Locked`
- `onboardingProjectSetup`
- `notificationPanelOpen`
- `pmoAssignmentReady`

These mount options are intentionally generic strings/booleans today. If they are tightened later, keep the types shared between app, shell, content, and persona config.

## PM Front Door And Onboarding Flows

Project Manager normal entry:

- Configured in `persona-flow.config.ts`.
- Mount state:
  - `authenticated: true`
  - `projectId: 'all'`
  - `selectedPage: 'workspace'`
  - `selectedView: 'pm101'`
  - `frontDoorMode: 'assigned'`

Onboarding "Take A Tour":

- Mounted from `AppComponent.takeTour()`.
- Starts authenticated in `workspace` / `pm101`.
- `frontDoorMode = 'assigned'`
- `guidedTourActive = true`
- `guidedTourExitMode = 'onboarding-assignment-flow'`

Onboarding "Proceed to front door":

- Mounted from `AppComponent.proceedToFrontDoor()`.
- Starts authenticated in `workspace` / `pm101`.
- `frontDoorMode = 'assigned'`
- `onboardingAssignmentFlow = true`
- `onboardingPm101Locked = true`
- `pmoAssignmentReady = false`

Guided tour targets:

- `project-switch`
- `workspace-tabs`
- `frontdoor-overview`
- `frontdoor-actions`
- `frontdoor-digest`
- `actions-subtabs`
- `action-board`
- `create-psr`
- `side-navigation`

The front-door tabs mean:

- Overview: project snapshot and journey cards.
- Manage My Work: calendar/board for dated work and task triage.
- Quick links: shortcuts to project plan, WBS, stage gate, change request, risks, issues, closure, benefits, reports, action board, calendar, and project rooms.

## PM Data Seeds Currently In The Monolith

Important seed collections currently live in `pm-console-content.component.ts`. The target architecture is to move them into typed fixture/config files.

Project list:

- UAE Research Map
- Global Anti-Scam Taskforce
- Counter Terrorism Operations
- Vision 2030
- NEOM Integration
- Smart City Alpha
- PMO Capability

Project register rows include stage, status, trend, manager, baseline dates, budget used/total, and priority.

Benefit register rows include:

- Improve research capability discovery
- Reduce duplicate funding calls
- Accelerate sponsor approvals
- Increase cross-border taskforce coordination
- Lift PMO adoption maturity
- Improve predictive operations response

Risk register rows include:

- Stakeholder data quality may delay baseline
- Commercial overrun on integration scope
- Vendor dependency slippage affects delivery dates
- Stage-gate evidence pack may miss the forum cutoff
- Benefits owner response is not yet confirmed

Other seed/config areas:

- Work board columns and task actions.
- Calendar timeline items.
- PM101 project previews and journey steps.
- Normal PM digest sections.
- Onboarding digest items.
- Reporting trend history.
- Project report register columns/rows.
- Overview/project plan field matrix.
- Schedule and scope rows.
- Budget plan config and state.
- Benefit plan config and rows.
- Risk plan config and rows.
- Issue, resource, change impact, related links, dependency configs.
- Change request rows and drawer options.
- Closure text blocks, actions, recommendations, benefit/risk/issue/lesson rows.
- Stage definitions and stage gate state.

Do not add more large data arrays to page components. Move new fixture/config data into typed files or services.

## Project Plan Architecture

Project plan entries:

- `quick`: Project Plan.
- `reports`: Reports and PSR flow.
- `stages`: Stage gate progress and evidence.
- `change-request`: Project change requests.
- `closure`: Closure workflow.

Primary project plan sections:

- Overview
- Schedule & Scope
- Budget
- Benefits
- Risk
- Resource

Additional project plan sections:

- Issues
- Change Impact
- Related Links
- Dependency
- Miscellaneous

Overview covers:

- Problem statement.
- Business drivers.
- Outcomes.
- Strategic objective links.
- Capabilities and services.
- Governance links.

Schedule & Scope covers:

- Approved dates and forecast.
- Milestones.
- End products.
- Management products.
- Dependencies.
- Mandatory watchlist items for benefits and risks.

Budget covers:

- Fiscal years.
- CAPEX/OPEX baseline and forecast.
- Actuals, committed, available.
- Funding sources.
- Monthly phasing.
- Budget rules.

Benefits covers:

- Benefit records.
- Benefit profile details.
- Measures, objectives, recipients, realization status.

Risk covers:

- Risk records.
- Risk profile tabs: identification, analysis, treatment.
- Actual and residual risk matrix.
- Treatments and treatment draft.

Resource covers:

- Role, sourcing, allocation, timing, attachments.

Issues covers:

- Issue type, criticality, raised/due dates, owner, status, resolution.

Dependency covers:

- Predecessor and successor project relationships.
- Impact, product, owner, status.

Change Request covers:

- Active, overdue, closed filters.
- Overview, impact, related links tabs.
- Types: Budget, Schedule, Scope.
- Impact tabs: benefits, capabilities, projects.

Closure covers:

- Overview, budget, benefits, risk, issues, lessons.
- Reason options, follow-up actions, recommendations, row lists, commentary.

## Shared Component System

Shared components live in `tasama-angular/src/app/shared`.

Current shared component inventory:

- `pm-console-icon.component.ts`: `span[pmConsoleIcon]` wrapper for Lucide icon rendering.
- `pm-console-status-pill.component.ts`: `span[pmConsoleStatusPill]` status/tone pill.
- `pm-console-table-action.component.ts`: table action button directive/component.
- `pm-console-toolbar.component.ts`: shared toolbar shell.
- `pm-console-row-action-menu.component.ts`: row popover action menu.
- `pm-console-register-table.component.ts`: configurable register table with selection, search, filter/export/add controls, column visibility, empty state, and row/cell action events.
- `pm-console-field.component.ts`: generic field supporting text, number, date, password, search, textarea, select, and money.
- `pm-console-date-field.component.ts`: date display/input wrapper.
- `pm-console-mode-tabs.component.ts`: segmented/tabs pattern with icons and fixed widths.
- `pm-console-side-nav.component.ts`: left rail nav.
- `pm-console-top-bar.component.ts`: PM top bar.
- `pm-console-project-dropdown.component.ts`: project switcher popover.
- `pm-console-project-cover-cropper.component.ts`: cover upload/cropper using canvas output.
- `pm-console-frontdoor-overview.component.ts`: PM front-door overview hero/card.
- `pm-console-frontdoor-action-cards.component.ts`: project action card group.
- `pm-console-no-project-operational-workspace.component.ts`: no-project / assignment workspace panel.
- `pm-console-digest-panel.component.ts`: right-side digest.
- `pm-console-overview-cards.component.ts`: metric/overview cards.
- `pm-console-reporting-trends.component.ts`: reporting trend rows.
- `pm-console-reporting-empty-illustration.component.ts`: reporting empty visual.
- `pm-console-work-calendar.component.ts`: calendar surface and popover preview.
- `pm-console-project-profile-card.component.ts`: profile card for project fields.
- `pm-console-risk-matrix.component.ts`: actual/residual risk rating matrix.
- `pm-console-risk-profile.component.ts`: reusable risk profile UI.
- `pm-console-benefit-profile.component.ts`: reusable benefit profile UI.
- `pm-console-agent-banner.component.ts`: benefit/risk AI generation banner.
- `pm-console-ai-guide-chip.component.ts`: contextual AI guidance chip/popover.
- `pm-console-agent-dock.component.ts`: floating agent entry/dock.
- `pm-console-agent-panel.component.ts`: chat/prompt panel.
- `pm-console-agent-conversation.component.ts`: message list.
- `pm-console-agent-message.component.ts`: individual agent message.
- `pm-console-agent-message.model.ts`: agent message types.
- `pm-console-agent-launcher.component.ts`: agent launch button.
- `pm-console-agent-orb.component.ts`: visual orb for agent UI.
- `pm-console-agent-responder.service.ts`: local/simulated responder service.

Component-first rule:

- Search `shared` before creating new UI.
- Generalize a close match with typed inputs/outputs/content projection before duplicating.
- Promote feature components to shared when a second persona/workflow needs them.
- Do not create second implementations of tables, overview cards, status pills, toolbars, drawers, tabs, buttons, or form rows without documenting why the existing family cannot support it.

## Executive Architecture

Executive files live in `tasama-angular/src/app/executive`.

Root:

- `executive-dashboard.component.ts`

Data:

- `executive-dashboard.data.ts`
- `executive-insights.data.ts`

Components:

- `executive-stat-card.component.ts`
- `executive-bulletin-item.component.ts`
- `executive-insight-card.component.ts`
- `executive-insights-page.component.ts`
- `executive-insights-header.component.ts`
- `executive-insights-sidebar.component.ts`
- `executive-insights-summary-card.component.ts`
- `executive-insights-dimension-list.component.ts`
- `executive-insights-kpi-row.component.ts`
- `executive-more-insights-panel.component.ts`

Executive flow:

- Login with Executive persona mounts `ExecutiveDashboardComponent` directly.
- Dashboard starts on `activeView = 'front-door'`.
- CTA opens `activeView = 'insights'` after a transition, unless reduced motion is preferred.
- Insights page emits `homeSelected` to return to the executive front door.

Executive dashboard:

- Uses a fixed 1440 x 810 design stage scaled to fit viewport.
- Shows Tasama logo, CTA, portfolio scope, AI bulletin, and insight cards.
- Current scope metrics: total programs `10`, total projects `25`.
- Current insight cards: portfolio performing and budget tracking.
- Current bulletins are placeholder/lorem copy and should be replaced with product-grade executive copy when designed.

Executive insights:

- Uses a fixed 1440 x 810 stage scaled down to fit viewport.
- Contains header, sidebar, summary strip, dimension navigation, KPI table, and more-insights panel.
- Summary cards include overall score, on-track, off-track, alert, not tracked, and not started.
- Dimension list includes foundational KPIs, execution health, planning/setup quality, risk/delivery assurance, governance/discipline, and strategic alignment/value.
- KPI rows are currently fixture data.

Executive implementation note:

- The executive experience is persona-owned and should remain outside the PM console content state machine.
- Shared PM primitives may be used if they are neutral and appropriate, but executive screens should not be coupled to PM shell state.

## Design System

Primary references:

- `tokens/tasama.tokens.json`
- `tokens/tasama.css`
- `docs/tasama-design-system.md`
- `tasama-angular/src/styles.css`

Brand foundation:

- Tasama should feel elevated, structured, innovative, premium, official, and operationally confident.
- Saudi relevance with a global business tone.
- Use structured grids, clean alignment, restrained hierarchy, and strong white space.

Core brand colors:

- TASAMA Blue: `#10069F`
- Antique Gold: `#B59E5F`
- Growth Green: `#ADDC91`
- Deep Green: `#173F35`
- Sky Blue: `#8DC8E8`
- Energy Orange: `#E87722`
- Charcoal: `#1D252D`

Typography:

- Brand typeface: Montserrat Arabic.
- Current web implementation uses Montserrat from Google Fonts and system fallbacks.
- Approved UI weights should not exceed semibold (`600`) except legacy/font fallback cases.
- Do not use pure black in UI. Use `#0b0b0b` for headings/high emphasis and `#2f2f2f` for normal body text where applicable.
- Letter spacing should be `0` unless the design role explicitly requires uppercase/kicker treatment.

Spacing/radius:

- Prefer tokens and established local patterns.
- Standard card radius should generally be 8px or less unless an existing design requires otherwise.
- Keep similar tabs/cards/drawers/forms aligned to the same content edges, padding, and gaps.

Icon rules:

- Use Lucide for every system icon.
- Use the existing `pmConsoleIcon` wrapper.
- Do not add inline SVG icons, emoji icons, or other icon libraries unless there is a clear product/design reason.
- Icon-only buttons need clear `aria-label` text.

Assets:

- General PM assets live in `tasama-angular/src/assets`.
- Executive assets live in `tasama-angular/src/assets/executive`.
- Onboarding workspace assets live in `tasama-angular/src/assets/onboarding-workspace`.
- Agent visual assets live in `tasama-angular/src/assets/adeo-agent` and `tasama-angular/src/assets/dotz-agent-light`.
- PM101 assets live in `tasama-angular/src/assets/pm101`.
- Front-door action assets live in `tasama-angular/src/assets/frontdoor-actions`.

## Styling Architecture

Current reality:

- Much styling is in the global `tasama-angular/src/styles.css`.
- Many components also use inline component-scoped `styles`.
- The design-token files exist but are not fully wired as a clean token layer across all Angular styles.

Future direction:

- Avoid adding more global CSS unless extraction is out of scope.
- Prefer component-scoped styles or reusable style primitives.
- When touching repeated patterns, consolidate classes and tokens instead of adding arbitrary one-off values.
- Keep Figma fidelity, but preserve product consistency across tabs, cards, tables, drawers, and forms.

## Local Persistence And Browser APIs

Current local persistence:

- `PmConsoleShellComponent` removes `tasama.sideNavExpanded` to avoid stale expanded rail preference.
- `PmConsoleRegisterTableComponent` can store visible column ids in localStorage when `storageKey` is provided.
- `PmConsoleContentComponent` stores quick-link pins and workspace table column visibility.
- Legacy project cover localStorage key is removed by `PmConsoleContentComponent`.

Browser API usage:

- Lucide script injection through `PmConsoleIconService`.
- Popovers/menus use `ElementRef`, `HostListener`, `requestAnimationFrame`, viewport measurement, and escape/document click handling.
- Project cover cropper uses canvas to export a JPEG data URL.
- Report/agent print flows open/write print windows or frames.
- Timers are used for animations, typing simulation, AI assist simulation, toasts, and transitions.

If server-side rendering is introduced, audit these browser APIs carefully.

## AI And Assistant UI

Current AI surfaces are UI simulations, not backend-integrated intelligence:

- Agent dock and panel.
- Agent conversation/messages.
- AI guide chips.
- Benefit/risk generator banners.
- Inline rewrite and AI assist flows in the PM content component.

Treat these as product UI patterns and prototype logic. If real AI integration is added later, isolate API/service logic in typed services rather than wiring network calls directly into page components.

## Known Technical Debt

Major known issue:

- `pm-console-content.component.ts` is still too large and does too much.

It currently contains:

- Large inline template.
- Page state.
- Fixture data.
- Table schemas.
- Form state.
- Formatting helpers.
- Workflow logic.
- Drawer logic.
- Repeated view sections.

The static `pm-frontdoor` is also hardcoded by design and should not be treated as production architecture.

Safe refactor direction:

1. Move seed data and table schemas into typed fixture/config files.
2. Extract one repeated UI pattern at a time.
3. Promote broadly useful controls into shared atoms/molecules/organisms.
4. Extract project-plan sections into feature components.
5. Convert `PmConsoleContentComponent` into a coordinator that chooses organisms/pages and passes typed state.
6. Add tests around pure calculations and extracted behavior as logic becomes isolated.

Do not rewrite the whole PM console in one pass unless explicitly requested.

## Target Folder Direction

The current app has `shared` and `executive`, with PM files at `src/app` root. The recommended future structure is:

```text
tasama-angular/src/app/
  core/
    services/
    utilities/
    models/
  shared/
    atoms/
    molecules/
    organisms/
  pm-console/
    data/
    models/
    components/
    pages/
    services/
  executive/
    data/
    models/
    components/
    pages/
  program-manager/
  portfolio-manager/
  pmo/
```

Move incrementally. Do not churn files without a real reason.

## Quality Bar

Before handing back code changes:

- Run the narrowest relevant verification command.
- For Angular behavior/UI work, prefer `npm run build` from `tasama-angular` when feasible.
- For meaningful UI work, run the app and visually verify changed screens on desktop and one narrower viewport when feasible.
- Confirm icons use Lucide through `pmConsoleIcon`.
- Confirm no pure black was introduced in UI styles.
- Confirm font weights do not exceed semibold for UI text.
- Confirm spacing and card rhythm match nearby screens.
- Confirm no new large static data was added to page components.
- Confirm repeated visual markup was extracted or the reuse decision was documented.
- Keep unrelated user changes intact.

For documentation-only changes, a build is not required unless the docs are generated from code. Use `git diff --check` or equivalent whitespace validation when useful.

## Agent Operating Protocol

When starting any future task:

1. Read `AGENTS.md`.
2. Read this `BIBLE.md`.
3. Inspect the relevant code before editing.
4. Respect persona boundaries.
5. Search `tasama-angular/src/app/shared` before adding UI components.
6. Prefer typed fixtures/services/utilities over page-level hardcoded data.
7. Keep changes scoped and verifiable.
8. Update this Bible if the project memory changes.
9. Add a Memory Log entry for meaningful changes.

When a user says "PM front door":

- Interpret it as the Project Manager PM101/operational landing inside the PM console, not the login page.
- Check `PmConsoleShellComponent`, `PmConsoleContentComponent`, front-door shared components, PM101 state getters, and onboarding flags.

When a user names a persona:

- Check `persona-flow.config.ts`.
- Check whether the persona has a real root or a placeholder.
- If implementing, create or use a persona-owned folder/root shell.
- Do not add non-PM persona route-level screens to `pm-console-content.component.ts`.

When a user asks for UI from Figma:

- Match Figma first.
- Reuse or generalize existing components before adding new ones.
- Use tokens and documented patterns.
- Visually verify if feasible.

## Memory Log

2026-05-25:

- Created `BIBLE.md` as the project-level handoff, memory, architecture, and AI-agent restart guide.
- Documented current Angular architecture, persona entry flow, PM front-door meaning, PM onboarding states, PM console structure, Executive structure, shared component inventory, design system references, known technical debt, and required update protocol.
- Added the rule that meaningful project changes must update this file in the same change set.
