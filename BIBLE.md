# Tasama Project Bible

Last updated: 2026-05-29

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
- A PMO My Workspace surface with portfolio/risk/benefit/issue workspace tabs and a Governance tab for forum, source, record, and report-register surfaces.
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
- PMO mounts the PMO governance shell directly, which now opens on a PMO-owned front door before the governance workspace.
- Program Manager currently mounts a placeholder shell.
- Portfolio Manager mounts a persona-owned portfolio shell.
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
- PMO has a dedicated governance workspace shell at `src/app/pmo-governance-shell.component.ts`.
- Portfolio Manager has a persona-owned portfolio shell.
- Program Manager is still a placeholder and should receive a persona-owned shell/folder when implemented.

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

- Owns the PMO front door and PMO My Workspace at the app root through `PmoGovernanceShellComponent`.
- The PMO front door is `PmoFrontdoorComponent`, backed by typed fixtures in `pmo-frontdoor.data.ts`, and reuses shared mode tabs, digest panel, action cards, icon wrapper, side nav, top bar, notifications, and agent dock.
- Uses `PmoGovernanceWorkspaceComponent` for the My Workspace tab frame, Governance lower tabs, Forums, Sources, Records, Reports, forum detail tabs, and record detail navigation.
- PMO concepts may appear in PM onboarding and assignment flows, but the PMO persona itself must not be implemented as a page mode inside the PM console.

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
- `pm-console-expandable-search.component.ts`: hover/focus expanding search control used by register toolbars where compact search should expand without moving the primary action.
- `pm-console-row-action-menu.component.ts`: row popover action menu with an optional trigger icon input for horizontal or vertical ellipsis variants.
- `pm-console-register-table.component.ts`: configurable register table with selection, search, filter/export/add controls, column visibility, empty state, row/cell action events, wrapped/icon text cells, hierarchical primary cells, PM-flow-aligned segmented trend cells, projected toolbar actions, and an optional expanded row-detail template.
- `pm-console-field.component.ts`: generic field supporting text, number, date, password, search, textarea, select, money, mandatory markers, and optional inline help icons.
- `pm-console-date-field.component.ts`: date display/input wrapper.
- `pm-console-mode-tabs.component.ts`: segmented/tabs pattern with icons and fixed widths.
- `pm-console-side-nav.component.ts`: left rail nav.
- `pm-console-top-bar.component.ts`: PM top bar with full-profile or avatar-only display modes.
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

## PMO Governance Architecture

PMO files currently live at the app root and should move into a future `pmo/` folder during a deliberate folder-structure pass.

Root:

- `pmo-governance-shell.component.ts`
- `pmo-frontdoor.component.ts`
- `pmo-report-review-progress.component.ts`
- `pmo-decision-intelligence.component.ts`

Workspace/data/components:

- `pmo-frontdoor.data.ts`
- `pmo-report-review-progress.data.ts`
- `pmo-decision-intelligence.data.ts`
- `pmo-governance-workspace.component.ts`
- `pmo-governance-workspace.data.ts`
- `pmo-governance-forum-detail-drawer.component.ts`
- `pmo-governance-forum-overview.component.ts`
- `pmo-governance-issue-drawer.component.ts`
- `pmo-governance-meeting-drawer.component.ts`
- `pmo-governance-record-detail-drawer.component.ts`
- `pmo-governance-record-detail.component.ts`
- `pmo-governance-record-drawer.component.ts`
- `pmo-governance-report-drawer.component.ts`
- `pmo-governance-source-drawer.component.ts`
- `pmo-governance-watchlist-risk-drawer.component.ts`

PMO flow:

- Login with the PMO persona mounts `PmoGovernanceShellComponent` directly from `AppComponent`.
- The shell opens on the PMO front door by default. `activeSurface` switches between `frontdoor`, `governance`, `report-review`, and `decision-intelligence`; Home returns to the front door, the My Workspace rail item or generic front-door action cards enter the workspace, the front-door Report & Review Progress action opens its dedicated report-review surface, and the front-door Insights & Decision Intelligence action opens its dedicated decision-intelligence surface.
- The PMO front door uses `PmoFrontdoorComponent` plus `pmo-frontdoor.data.ts` for the Figma-derived tabs, digest text, scope metrics, portfolio/program health rows, action cards, quick links, and PMO Manage My Work fixtures. The PMO Manage My Work tab mounts the existing `PortfolioManagerActionsComponent` calendar/board implementation with PMO action data, PMO-specific filters, aggregate high-volume queue tiles, and the board detail panel enabled. PMO queues group approve/review plans, status reports, benefits, change requests, and governance committees; selecting a board tile expands the underlying list in the right-side board panel and opening it uses the shared portfolio action drawer at PMO shell level.
- PMO front-door Quick links reuse the same PM front-door `workspace-quick-links-view` and `selected-project-quick-link-*` card pattern rather than a new PMO card family. The Figma-derived quick-link fixture list currently includes Portfolio Register, Benefit Register, Risk Register, Issues Register, User Management, Lessons learnt, Upcoming Forums, Change request Register, Report Builder, and Dependency Register. Quick-link clicks emit a typed `PmoGovernanceWorkspaceTarget` through `PmoGovernanceShellComponent` so implemented destinations can open the matching My Workspace top/lower tab.
- `PmoReportReviewProgressComponent` owns the PMO Report & Review Progress front-door subpage. It is backed by typed report tabs, filter summaries, report columns, report-card fixtures, and report-drawer document/status fixtures in `pmo-report-review-progress.data.ts`, uses Lucide icons through `pmConsoleIcon`, and matches the supplied Figma content-area frames with the illustrated header, Standard/Custom report tabs, top filter controls, the Standard Reports Portfolio/Programs/Project columns, and the Custom Reports Scheduled/Ad-hoc columns plus Report Builder CTA. The report board keeps the toolbar fixed within the content area and gives each report column its own vertical card-list scroll when viewport height is tight. The shared toolbar funnel opens a published-date filter popover that applies across both Standard and Custom report tabs and reuses `PmConsoleDateFieldComponent`. Standard Report cards emit the selected report to `PmoGovernanceShellComponent`, which mounts `PmoReportReviewDrawerComponent` at shell level so its backdrop and right drawer cover the full viewport instead of being trapped inside the animated report page host. The drawer has Project Plan download rows and a Project Status Report tab rendered as a status-register table with chip states and Create/Edit/Download actions.
- `PmoDecisionIntelligenceComponent` owns the PMO Insights & Decision Intelligence front-door subpage. It is backed by typed accordion/card fixtures in `pmo-decision-intelligence.data.ts`, uses Lucide icons through `pmConsoleIcon`, and matches the supplied content-area frames with the illustrated 108px header, back action, Manage Delivery expanded by default, and Figma-style closed-stage rows for the remaining accordions. Closed rows use the compact 67 x 60 artwork thumbnail treatment from the reference, not the larger expanded category-card scale. Performance Trends and Governance Intelligence keep their full-card content and render it when expanded. The shell supplies the shared Tasama top bar and left rail; the content component intentionally does not duplicate shell chrome.
- The shell reuses the Tasama PM top bar, left side nav, notifications panel, and agent dock while keeping PMO content outside the PM console content monolith. The PMO top bar uses the shared top bar's avatar-only profile mode to match the supplied front-door design.
- The My Workspace header back arrow emits from `PmoGovernanceWorkspaceComponent` to `PmoGovernanceShellComponent.goHome()`, returning the PMO persona to its front door and clearing workspace overlays.
- PMO My Workspace opens on the Portfolio Register top tab by default. The top tabs are Portfolio Register, Risk Register, Benefits Register, Issues Register, and Governance. Portfolio Register reuses the Portfolio Manager `PortfolioWorkspaceRegistersComponent` with its internal sub-tabs hidden, and that register now renders its portfolio/program/project hierarchy through the shared `PmConsoleRegisterTableComponent` instead of local table markup. The first level shows portfolio rows and a standalone-project group, expanding a portfolio reveals programs, and expanding a program reveals projects. The remaining non-Governance tabs currently show placeholder content until their product surfaces are specified.
- The Governance top tab contains the lower Forums, Sources, Records, and Reports register tabs; there is no separate Home tab inside the workspace.
- The Governance lower-tab registers in `PmoGovernanceWorkspaceComponent` use `PmConsoleRegisterTableComponent` for Forums, Sources, Records, and Reports. Keep the current typed PMO fixture data and search/scoping getters as the source of truth, then adapt them into shared register-table rows/columns instead of reintroducing local `<table>` markup. The Reports lower tab follows the same register toolbar rhythm as PMO table tabs: `PmConsoleExpandableSearchComponent` sits in the right action cluster immediately before the primary Create Report CTA, followed by the shared report-template register table.
- Create Report in the Governance Reports lower tab opens `PmoGovernanceReportDrawerComponent`, a feature-scoped Tasama side drawer backed by typed report-template draft defaults/options in `pmo-governance-workspace.data.ts`. The drawer captures Report Name, Filters, Records, Division, People, Time Frame, and Group By, then saves a user-created report-template row into the reports table.
- Create Meeting in the forum-detail Meetings tab uses the feature-scoped `PmoGovernanceMeetingDrawerComponent`, which reuses `PmConsolePlanDrawerComponent` and typed meeting draft defaults from `pmo-governance-workspace.data.ts`.
- Add Source actions in the PMO Sources register and the forum-detail Sources tab use the feature-scoped `PmoGovernanceSourceDrawerComponent`, which reuses `PmConsolePlanDrawerComponent` and typed source draft defaults/options from `pmo-governance-workspace.data.ts`. The forum-detail variant adds Add Source/Add Existing Source radio controls and starts the Type field on a Select placeholder, matching the governance reference while keeping Tasama styling.
- Add Record actions in the PMO Records register and the forum-detail Records tab use the feature-scoped `PmoGovernanceRecordDrawerComponent`. It reuses `PmConsolePlanDrawerComponent`, uses typed record draft defaults/options from `pmo-governance-workspace.data.ts`, and styles the Action/Decision choice as Tasama radio controls.
- Add to Watchlist in the forum-detail Watchlist tab opens `PmoGovernanceWatchlistRiskDrawerComponent`, a wider `PmConsolePlanDrawerComponent` variant with risk-category tabs, search, selectable risk rows, a scroll-only table area, and typed picker fixtures from `pmo-governance-workspace.data.ts`. The shared plan drawer now supports configurable drawer width, projected footer prefix content, and optional submit-first button ordering for picker-style drawers.
- Add Issue in the forum-detail Issues tab opens `PmoGovernanceIssueDrawerComponent`, which reuses `PmConsolePlanDrawerComponent` and typed issue draft/options from `pmo-governance-workspace.data.ts`. The drawer captures required Issue and Resolution text, optional Description/Priority/Status/Owner, and Date Raised/Issue Due Date/Date Closed values defaulting to the user's current day.
- PMO forum/source/record register action rows use `PmConsoleExpandableSearchComponent` before the primary add action so the primary button remains the rightmost control.
- PMO register tables should not use pagination, page-size controls, separate chevron-only open columns, standalone row edit/delete buttons, or local table markup when the shared register table can represent the data. Keep rows in scrollable shared table containers, keep primary open behavior on the row or name link when available, and place row-level view/edit/delete actions inside the shared register-table `menu` cell. The shared row-action trigger is plain vertical dots without a circular border/background, matching the PM flow tables.
- The Forums table emits the selected forum to `PmoGovernanceShellComponent`, which mounts `PmoGovernanceForumDetailDrawerComponent` as a full-frame overlay above the top bar, left rail, agent dock, and workspace. The Governance register stays mounted behind the overlay and the drawer owns its own meetings, sources, records, watchlist, issues, search, and scope state using typed governance fixtures.
- Forum detail opens on an editable Overview tab before Meetings. `PmoGovernanceForumOverviewComponent` edits forum profile data from `PmoGovernanceForumRow`, including name, type, category, description, created metadata, chair, secretariat, members, and forum ID. It composes existing Tasama primitives such as `PmConsoleFieldComponent`, `pmConsoleIcon`, and `PmConsoleStatusPillComponent`; save events flow through `PmoGovernanceForumDetailDrawerComponent` to `PmoGovernanceShellComponent`, which updates the forum collection passed into `PmoGovernanceWorkspaceComponent`. The Overview profile, identity, and ownership cards stack vertically rather than using a side column. The drawer should not expose a top-level Edit Forum Details action, and forum-detail tabs are left-aligned with the drawer content edge.
- Forum detail drawer tables should use `PmConsoleRegisterTableComponent` rather than local `<table>` markup. Its Meetings, Sources, Records, and Watchlist tabs use column min-widths that intentionally overflow inside the drawer so the shared table scroll container provides horizontal scrolling when needed. The Watchlist category rail follows the PM report drawer's vertical section-navigation pattern. Picker drawers may use a local scroll table only when the interaction needs controlled multi-select rows and footer selection summaries that the shared register table does not yet own; promote that behavior to the shared table if it appears in another workflow.
- The All Records table opens `PmoGovernanceRecordDetailDrawerComponent` when a row or row-menu View record action is clicked. The drawer follows the existing PMO forum-detail side-drawer shell: 1040px desktop width cap, grey header, compact tab strip, and card-based Overview/Relationships/Activity sections. Closing the drawer returns focus to the Records register context.

PMO record detail:

- Detail fixture data belongs in `pmo-governance-workspace.data.ts`.
- The supplied governance HTML reference is represented by `pmoGovernanceRecordDetails.r65`, including overview, ownership, related projects, related sources/recommendations, related risks, empty related sections, and activity log entries.
- `pmoGovernanceRecordDetailFor(record)` returns the full fixture when available and a typed fallback detail for other records so every record row can open consistently.
- The detail drawer is feature-scoped, uses Lucide through `pmConsoleIcon`, and keeps the legacy governance information model while applying the compact forum-detail drawer scale, Tasama colors, and tabbed card layout.
- In drawer mode, the workspace keeps the Records register mounted behind the overlay and uses the component header close control, shared drawer backdrop click, or Escape to dismiss the detail.

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

2026-05-29:

- Refined the Portfolio Manager "My Actions" Kanban cards and lane scroll behaviors in `portfolio-manager-actions-pm.component.ts`:
  - Ensured divider lines, owner name text, avatar icons, and the "Open" CTA display consistently and beautifully for cards in all three columns (Overdue, This week, and Upcoming).
  - Dynamically prefixed project/program names with "Project: " or "Program: " based on `item.kind` (`kind === 'governance'` translates to "Program", all other kinds are "Project").
  - Implemented encapsulated independent scroll containers on each column by defining explicit height restrictions and scroll properties (`overflow-y: auto !important`) locally, preventing parent container stretch and page-level scrolls.
  - Programmatically and visually restricted card interaction (clicks) to only "Plans" and "Governance & committee" items. Disabled hover transitions and changed cursor to `default` for non-clickable cards, and set the "Open" CTA color to muted gray for disabled items.
  - Resolved display specificity collisions by removing local `!important` from flex displays on `.board-view` and `.calendar-view`. This allows the global `.is-hidden` helper to apply correctly, hiding the inactive view and restoring the calendar to its clean, full-height appearance.
  - Increased bottom padding inside `.new-task-card` to `24px` to add more space below the owner name and CTA.
  - Increased the gap between columns and filters by setting the control row padding to `padding: 0 0 20px !important`.

- Redesigned the cards in the 'Portfolio manager' 'My actions' Kanban view to match Image 2:
  - Updated `portfolio-manager-actions-pm.component.ts` to render the redesigned `.new-task-card` button layout: Type pill on top, due date with calendar icon below it, action/item name in bold heading font, project/program name in muted grey subtitle font, a horizontal separator line, owner's initials avatar alongside their full name on the left, and a blue/indigo "Open" CTA with a chevron arrow on the right.
  - Implemented `getCardTypePillClass(type)` to apply type-specific pill class names and `getAvatarStyle(owner)` to paint coordinated avatar text/background colors.
  - Integrated customized type pill CSS rules with precise HSL/hex color palettes matching "My calendar" view exactly: Plans (`#3188b5`), Governance committee (`#3454c4`), Status reports (`#6f2095`), Change requests (`#c4984f`), Benefits (`#166c49`), and Risk (`#b91c1c`).
  - Added new typed data fixture file `portfolio-manager-actions-pm.data.ts` containing the custom action items specifically for the Portfolio Manager (4 Overdue, 6 This week, and 12 Upcoming) distributed across all 6 action types to avoid component-level mock data and maintain proper counts.

- Isolated picker and visual refinements for 'Portfolio manager' 'My calendar' view:
  - Added component-scoped CSS rule in `pm-console-work-calendar.component.ts` to hide the Today badge in the Today date cell.
  - Added 4 new Risk kind action items to `portfolioActionItems` in `portfolio-manager-actions.data.ts` to show up on May 13, May 19, May 20, and May 27.
  - Created a dedicated isolated `PortfolioManagerActionsPmComponent` (`portfolio-manager-actions-pm.component.ts`) for the Portfolio Manager console to protect other views/personas like PMO.
  - Updated the dropdown target picker in `PortfolioManagerActionsPmComponent` to default to "All programs & projects" and removed the "Portfolios" group entirely from `targetGroups` list.
  - Integrated the new `PortfolioManagerActionsPmComponent` in `portfolio-manager-landing.component.ts`.

- Completed changes to 'Portfolio manager' 'My calendar' view:
  - Populated the calendar with more chips of types Benefits, Change Requests, Risk, Plans, Governance Committee, Status reports with exact hex colors: Benefits (`#166C49`), Change requests (`#C4984F`), Risk (`#B91C1C`), Plans (`#3188B5`), Governance committee (`#3454C4`), Status reports (`#6F2095`), retaining 10% soft background and 25% border color opacity.
  - Added 6 new mock items on May 26, 2026 to populate the calendar with all requested types matching Figma Image 5.
  - Updated the dropdown types filter to display exactly the six requested types plus 'All types'.
  - Added `getFilterIdForKind(kind)` and `getItemSubtitle(item)` to ensure robust filtering and dynamic subtitle generation.
  - Redesigned the single-item hover detail card (Figma Image 4) to show only the type pill, an arrow, bold label description, and subtitle, removing View buttons or metadata headers.
  - Redesigned the multi-item day agenda hover popup (Figma Image 5) for tiles with more than two items to display a clean header with date and items count, followed by a list of cards matching the single-item layout.
  - Successfully verified building type safety with a zero-warning, zero-error Angular CLI build.
  - Implemented `getCalendarChipLabel(item)` to truncate long chip titles to a maximum of 16 characters (e.g. "Governance committee" -> "Governance comm...").
  - Configured chips `.calendar-event` and `.calendar-event-title` in CSS with full flexbox dynamic scaling and ellipsis overflow to ensure all chips fit cleanly within the day tile without any border clipping.
  - Removed all `max-height` and `overflow-y` scrolls from the `.calendar-popover-multi-list` styles, allowing the day agenda popup cards container to expand in height dynamically.
  - Increased the vertical gap between the action name (`.calendar-popover-title`) and project/program subtitle (`.calendar-popover-subtitle`) in popovers by exactly 4px.
  - Updated calendar event pills `.calendar-event` in CSS to hug content using `width: fit-content; display: inline-flex; padding: 0 6px;` to prevent unnecessary expansion for shorter content.
  - Disabled pointer clicks on status reports, benefits, change requests, and risks chips globally in `openAgendaItem` while restricting cursor pointer styling specifically toclickable `'Plans'` and `'Governance committee'` types.
  - Implemented the `getItemDisplayTitle(item)` helper which dynamically appends `" (Upcoming Meeting)"` to `'Governance committee'` items in popups to indicate meeting status unless already specified.

2026-05-28:

- Completed changes to 'PMO console' 'My actions' tab styling colors:
  - Updated card styling color hex codes for Plans (`#79BADD`), Governance (`#3454C4`), Status reports (`#6F2095`), Change (`#C43472`), and Benefits (`#166B49`).
  - Maintained the current logic of 25% side-stroke opacity, 10% icon container background opacity, and 100% icon color while supporting broad case-insensitive selectors.
- Completed Phase 2 changes to 'PMO console' 'My calendar' view:
  - Default replaced "All programs and projects" with "All portfolios" in the target picker filter dropdown.
  - Made multi-item pop-up responsive in height and completely non-scrollable by removing max-height constraints and overflow scrolls.
  - Redesigned each row inside the multi-item pop-up to render a Type chip pill, a neutral project/program name pill, the bold Task name description, and its action-specific current CTA.
  - Expanded the layout spacing (gap) and padding of the single-item hover pop-up to `16px` for enhanced aesthetics and readability.
2026-05-28:

- Replaced the static "(Pending)" status metadata text in the side drawer action list cards with dynamic relative due state text:
  - If the parent action card is in the "Overdue" lane/column, the card metadata displays as `(Overdue)`.
  - If the parent action card is in the "This week" or "Upcoming" columns, it dynamically parses `report.date` relative to May 26, 2026 to calculate and render the relative days remaining, displaying as `(Due in x days)`.
- Updated the action type chips in the PMO Console "My calendar" view to use specific, customized colors while keeping the soft background tint (10%), border (25%), and full text/dot (100%) opacity:
  - Plans: `#8DC8E8` (soft sky blue)
  - Governance Committees: `#3454C4` (deep blue)
  - Status reports: `#6F2095` (royal purple)
  - Change requests: `#C43472` (vibrant magenta)
  - Benefits: `#166B49` (emerald green)
  - Seamlessly applied these theme color variables across inline calendar cells, hovering preview cards, and agenda list preview overlays by coupling selectors to standard data attributes (`[attr.data-event-type]`).
- Redesigned the action detail cards visible inside the PMO Console "My Actions" tab side drawer to exactly match Figma Image 2 and brand color opacities:
  - Replaced the card header date and avatar column with a clean, responsive layout.
  - Implemented the `getNormalizedCardType(report)` typescript helper to accurately categorize action items (`Plans`, `Governance Committees`, `Status reports`, `Change requests`, `Benefits`, `Dependency`, `Risk`).
  - Added a top-aligned container displaying the brand-styled `action-type-pill` for each item using the exact color and opacity rules matching Phase 3 (25% border, 10% background, and 100% text color).
  - Maintained bold action name and project name stacked immediately below the pill.
  - Rendered a discreet divider line separating the body from the horizontal footer.
  - Restructured the footer to display a calendar icon and due-state metadata horizontally stacked on the left, next to the dynamic chevron arrow CTA link (`report.cta || 'Open'`) on the right.
- Completed changes to 'PMO console' 'My calendar' view:
  - Configured hovering over individual chips inside collapsed cells (dates with more than two items) to open the multi-item day agenda hover popup rather than the single project details card.
  - Mapped all calendar chips to display exactly one of the 5 requested category names (`Plans`, `Status reports`, `Benefits`, `Change requests`, `Governance Committees`) based on item `kind` for both collapsed and non-collapsed blocks.
  - Added collapsible `Portfolios` group in the program/project target picker dropdown on the "Manage My Work" control toolbar, populating active portfolio names from `portfolioRows` in `portfolio-workspace.data.ts` and implementing dynamic target matching and count labels.
  - Updated the single-item hover detail pop-up content to show the mapped Type chip, Project name, dynamic Task name title, and a "View" CTA while removing the Date section entirely.
  - Re-mapped generated PMO calendar items in `generatePmoCalendarWorkItems()` to have realistic randomized project assignments and distinct, descriptive task names (e.g. `Review ${project} weekly report`, `Verify ${project} benefit evidence`) so Task name and Type do not share identical content.
- Updated the first PMO front-door Overview journey card title in `pmo-frontdoor.data.ts` to Title Case: "Set Up Your Framework".
- Corrected the PMO "My Actions" tab compact cards CSS grid columns (`grid-template-columns: auto minmax(0, 1fr) auto auto !important;`) to perfectly accommodate the 4-column children layout following inner side stroke removal, successfully preventing the lavender count circles from stretching horizontally.
- Refined the PMO "My Actions" tab compact cards by removing the inner `.compact-action-accent` side stroke element positioned immediately to the left of the icon container, cleanly retaining only the premium outer card edge side stroke (drawn by the card's `::before` selector).
- Completed the PMO "My Actions" tab card styling, color opacity rules, and layout refinements in `PortfolioManagerActionsComponent`:
  - Updated the board column header icons to render as standalone grey icons (`#657084`) with transparent backgrounds and no surrounding containers, perfectly matching Image 2.
  - Increased the compact card height (`min-height: 64px`) and added generous top/bottom padding (`14px`) around the title text.
  - Applied a premium light font weight (`font-weight: 300`) to the card titles (`.compact-action-title`, `.task-card-title`) and View All CTAs (`.compact-action-view span`, `.task-card-action span`).
  - Styled the count container around the numbers (`.compact-action-count`) as a circular `#EEF4FF` container with light `#2F2F2F` number text at a light font weight.
  - Implemented exact custom color shade mapping and specific opacity rules (25% side stroke, 10% icon container background, 100% icon color) based on task types:
    - Governance Committees: `#0B0482`
    - Change Requests: `#C43472`
    - Status Reports: `#84509D`
    - Project Plans: `#3454C4`
    - Benefits: `#4ED0FF`
  - Re-distributed the random calendar work item generator thresholds in `pmo-frontdoor.data.ts` to ensure that all 3 columns (Overdue, This week, and Upcoming) are beautifully populated with action cards.
- Redesigned the "My Actions" board individual task cards (`.task-card`) in `PortfolioManagerActionsComponent` to match the premium, single-row grouped card layout (Image 2):
  - Modified the card structure in the board template to remove the obsolete top type pill, project name sub-headline, user avatar initials circle, and due-date text metadata.
  - Implemented the brand-specific colored icon container (`.task-card-icon`) on the left of each card using dynamic Lucide icons mapping through `boardDetailIcon(item)`.
  - Nested the card title and total action volume count side-by-side in a clean flex layout container (`.task-card-title-container`), rendering the count inside a light lavender circular pill (`.task-card-count`).
  - Added a thick left-side accent stroke (`.task-card::before`) with a 12px border radius, fully integrated with the component's existing color theme palette rules (`.blue`, `.red`, `.green`, `.amber`, `.neutral`).
  - Updated the right-aligned call-to-action button to render a standardized "View All" CTA with a premium chevron chevron-right icon.
  - Set a 12px border radius, 50px compact card min-height, grid column alignments, and modern micro-interaction hover scaling effects (`translateY(-1px)`).
  - Verified compilation success with a zero-warning, zero-error Angular CLI build.
- Completed the PMO "Manage my work" "My actions" tab grouping and side drawer transition:
  - Implemented the `filteredGroupItems` getter inside `PortfolioManagerActionDrawerComponent` class to support real-time searching and filtering of task list group items within the side drawer.
  - Implemented typescript helper methods `formatCardDate(dateStr: string)`, `getOwnerFullName(initials: string)`, and `handleDetailItemClick(detail: PortfolioActionItem)` to enable dynamic date parsing, initials-to-name lookup, and smooth deep-linking from grouped task cards to detailed single-item views inside the side drawer.
  - Added tone-specific CSS styling classes (`.blue`, `.red`, `.green`, `.amber`, `.neutral`) for `.report-icon-bg` and `.overdue-pill` elements to ensure drawer visual alignment with each action type's theme.
  - Added background color styles for additional user initials (`avatar-fq`, `avatar-ah`, `avatar-sa`, `avatar-fa`) to visually enrich avatar displays.
  - Verified stability with a zero-warning production build compilation.
- Redesigned the calendar day grouping logic for cells with multiple scheduled items in `PmConsoleWorkCalendarComponent`:
  - Replaced the generic "N actions" button with individual, project-specific `.calendar-event` buttons for the first two items, showing their project names in the standard brand layout (dot, color tone, text styles, etc.).
  - Added a stylish, clickable `+N` badge beside the second project button, which triggers the day preview popover containing all scheduled items when clicked or hovered.
  - Implemented `calendarEventProjectTitle` helper method to cleanly truncate long project names with an ellipsis.
  - Updated the CTA label for all items rendered in the multiple-items hover card popover (`previewCell`) to read "View" instead of dynamic actions (e.g. "Open work item", "Open report"), ensuring a cleaner and more consistent user experience.
- Updated the PMO front door and left navigation bar according to new requirements:
  - Enabled the program/project selector dropdown filter (`[showTargetPicker]="true"`) on the "Manage My Work" tab workspace control bar directly to the left of the "All PMO actions" dropdown.
  - Removed the 'All portfolios' scope selector dropdown in the top right of the Overview tab (`pmo-frontdoor.component.ts`) and adjusted the operational tab container max-width to allow clean layout expansion.
  - Renamed the "Create & manage" journey card action to "Manage Portfolio Workspaces" in `pmo-frontdoor.data.ts`.
  - Reconfigured the PMO left navigation rail (`pmo-governance-shell.component.ts`) to contain "Home" (with the standard home icon), "My Workspaces" (with the layout-grid icon), and "Dashboards" (with the chart-column icon, marked disabled/unclickable as shown in image 2).
- Redesigned the multi-action calendar popup/hover card (`PmConsoleWorkCalendarComponent`) to align with the premium Figma designs in the PMO "Manage My Work" landing tab:
  - Transformed the card row layout into a clean three-column structure (status dot, text info column, right-aligned blue CTA).
  - Cleaned up the text details to show the task title (`item.label`) in bold charcoal (`#0b0b0b`) and combined the project name and task kind in a muted gray (`#536071`) subtitle separated by a hyphen (`{{ item.project }} - {{ itemKindLabel(item) }}`).
  - Removed the redundant bold Project Name pill border and background, enabling smooth left-alignment of all text items.
  - Relocated the dynamic blue CTA link (e.g. "Open schedule", "Open risk") to the right-most column of each item card, vertically centered.
  - Introduced premium, status-tailored border and subtle background colors for each action card based on its status tone (blue, red, green, neutral) to boost micro-aesthetics and interactive hover/focus animations.
  - Verified through a complete, successful Angular CLI production build.
- Updated the welcome subtext message on the PMO landing view (`pmo-frontdoor.component.ts`) from "portfolio" to plural "portfolios" to accurately reflect multi-portfolio governance contexts without altering any other visual properties.

2026-05-27:

- Added Status Reports section to PMO Overview with preview cards showing overdue reports.
- Created `PmoStatusReportsDrawerComponent` for the right-side slide-in panel showing all status reports with search, owner info, and open actions.
- Added `PmoStatusReport` interface and `pmoStatusReports` fixture data in `pmo-frontdoor.data.ts`.
- Status Reports drawer opens when clicking "View all" or any preview card; shows 5 overdue reports with dates, project names, and owner avatars.

- Disabled the PMO front-door Set up your framework and Access & Manage Learning action cards so they render as static, non-clickable tiles with no CTA arrow, while Create & manage, Report & Review Progress, and Insights & Decision Intelligence remain interactive.
- Reworked the PMO front-door overview banner to match the supplied Figma node: the banner now uses a centered 976-1280 x 264 composition inside an expanding blue gradient shell, uses the exact linked Figma overall-health arrow SVG asset with cyan-faded grid lines and an expanded crop window so the grid blends into the banner background, pins the metric chips to the banner's left edge on wide screens, lets the main health and budget clusters expand outward from center without reaching the banner edges, aligns the overall-health illustration-to-copy spacing with Budget Health, offsets the complete unclipped budget illustration left so it avoids the budget card, and keeps health and budget headings at 14px with softer 12px health subtext.
- Aligned the PMO front-door Welcome/Daily Digest right rail with the supplied Figma node: the PMO digest now uses the 320px rail width, Figma copy, Montserrat 12/16 digest typography, #0b0b0b item text, #777777 section labels, #10069f medium portfolio emphasis, 12px item padding, and PMO-scoped gradient/card overrides while preserving the shared digest component for other personas.

2026-05-26:

- Reduced the PMO Insights & Decision Intelligence collapsed accordion artwork to the compact 67 x 60 thumbnail scale shown in the reference rows, with tighter radius/shadow and spacing while preserving the expanded category-card treatment.
- Updated the PMO Insights & Decision Intelligence collapsed accordion rows so closed sections use a compact rounded gradient/glass thumbnail from the same Figma artwork as the expanded category card, replacing the previous Lucide-only purple square while preserving the title and chevron interaction.
- Replaced the PMO Insights & Decision Intelligence expanded category-card artwork with the supplied Figma glass-card assets for Manage Delivery, Performance Trends, and Governance Intelligence; the existing typed section fixture now owns each card's artwork metadata while the component preserves the Figma blue gradient, compact radius, shadow, and green section title treatment.
- Reworked the visible PMO Governance lower-tab registers in `PmoGovernanceWorkspaceComponent` to use the shared `PmConsoleRegisterTableComponent` for Forums, Sources, Records, and Reports, preserving the existing PMO fixture arrays, search/scoping getters, row-open behavior, and drawer actions while removing local visible table markup from those tabs.
- Adjusted shared calendar hover behavior so `PmConsoleWorkCalendarComponent` uses the custom hover card without browser-native `title` tooltips, aligns the popover arrow to the hovered calendar item even when clamped near viewport edges, and changed `PortfolioManagerActionsComponent` to use `workspaceTitle` instead of a `title` input so PMO Manage My Work does not expose a host-level native tooltip.
- Added the PMO Insights & Decision Intelligence front-door subpage as `PmoDecisionIntelligenceComponent`, backed by typed accordion/card fixtures in `pmo-decision-intelligence.data.ts`; the PMO front-door Insights & Decision Intelligence card now opens this PMO-owned Figma-matched content area while the shared shell continues to provide the top bar and left rail.
- Added the remaining PMO Insights & Decision Intelligence full-card rows from the supplied Figma frame: Performance Trends now has 2 cards, Governance Intelligence now has 3 cards, and the section chevrons now toggle real expanded/collapsed state instead of being decorative.
- Adjusted the PMO Insights & Decision Intelligence accordion default state so only Manage Delivery opens initially, while collapsed Performance Trends and Governance Intelligence rows use the supplied closed-stage card treatment with a purple thumbnail, blue title, subtle border/shadow, and right-aligned chevron.
- Aligned the shared `PmConsoleRegisterTableComponent` trend cell and Portfolio/PMO Status Trend column sizing with the PM flow Workspace Project Register treatment: one 34px segmented rounded control with internal dividers and Lucide status icons rather than separate small outline chips.
- Reworked the Portfolio Register inside `PortfolioWorkspaceRegistersComponent` to use the shared `PmConsoleRegisterTableComponent` rather than a local `<table>`, preserving the current portfolio/program/project data, expansion hierarchy, Add new menu, summary pills, and three-period trend values. The shared register table now supports hierarchical primary cells, PM-flow-aligned segmented trend cells, and projected toolbar actions for this and future register variants.
- Added the PMO front-door Quick links tab using the shared PM front-door quick-link card/grid classes, populated it from the supplied Figma options, added the PM-style All Portfolios selector, and wired quick-link clicks through typed workspace targets so implemented register links land on the matching My Workspace tab.
- Removed the `div.pmo-status-reports-section-title` from the PMO landing/front door Overview page footer status reports section.
- Updated the right panel drawer (`PortfolioManagerActionDrawerComponent`) when an overdue status report action card is clicked, perfectly matching the provided Figma screenshot. Added a search input box, dynamic counts, custom card styles (calendar icons, overdue date metadata, main titles, project scopes, circle initials avatars, and active "Open" link triggers).
- Updated action board cards (`.task-card::before` and `.compact-action-card::before`) side stroke opacity to 80% (`opacity: 0.8`) for a more refined visual look.
- Refined PMO front-door Manage My Work into aggregate PMO work queues using the existing `PortfolioManagerActionsComponent`: plan approvals, status reports, benefits, change requests, and governance committees now show high-volume counts on calendar/board tiles, expand into a right-side board list, and open the shared shell-level action drawer with all underlying queue items.
- Updated PMO My Workspace to land on the Portfolio Register tab by default, with the PMO-facing primary tab label restored to Portfolio Register while keeping the shared portfolio/program/project hierarchy content.
- Added the PMO Report & Review Progress front-door subpage as `PmoReportReviewProgressComponent`, backed by typed fixtures in `pmo-report-review-progress.data.ts`; the PMO front-door Report & Review Progress card now opens this PMO-owned Figma-matched reports board instead of the generic My Workspace surface.
- Added the Figma-matched Custom Reports tab inside `PmoReportReviewProgressComponent`, including Scheduled Reports and Ad-hoc Reports two-up report cards, recurrence/date metadata, and the Report Builder toolbar action wired to the existing tab control.
- Added the Figma-matched PMO Report & Review Progress right-side report log drawer. Standard Report cards now open `PmoReportReviewDrawerComponent`, backed by typed drawer tab/document fixtures and rendered with the supplied header tabs, close affordance, and download table.
- Added the Figma-matched Project Status Report tab inside the PMO Report & Review Progress drawer. It now switches from the Project Plan download table to a typed seven-column status table with Not Created/Draft/Submitted and Not Tracked/Alert/On Track chips plus Create/Edit/Download row actions.
- Moved the PMO Report & Review Progress report drawer mount from the animated content page into `PmoGovernanceShellComponent`, fixing the drawer/backdrop to cover the full viewport height rather than only the report content area.
- Added a published-date filter popover to the PMO Report & Review Progress toolbar funnel. The filter reuses `PmConsoleDateFieldComponent`, applies to both Standard and Custom report tabs, and recalculates visible report counts while preserving the existing tab/column layout.
- Fixed PMO Report & Review Progress card-board scrolling by making the content body allocate remaining height to the report columns and allowing each column's card list to scroll vertically.
- Wired the PMO My Workspace header back arrow to return to the PMO front door through `PmoGovernanceShellComponent.goHome()`.
- Replaced the PMO My Workspace Portfolio Register placeholder with the shared Portfolio Manager Program & Project register. `PortfolioWorkspaceRegistersComponent` now accepts `showRegisterTabs` so PMO can reuse the program/project table without embedding the Portfolio Manager's internal risk/benefits sub-tabs, and its project table keeps a stable horizontal-scroll width on narrow panes.
- Added the portfolio parent layer to the shared Portfolio Manager register fixture/component: top-level rows are portfolios plus a standalone-project group, portfolio expansion reveals programs, program expansion reveals projects, and Portfolio/Program/Project/Project Group chips now use distinct colors.
- Reframed the PMO Governance Workspace as PMO My Workspace. `PmoGovernanceWorkspaceComponent` adds top tabs for Portfolio Register, Risk Register, Benefits Register, Issues Register, and Governance, removes the old workspace Home tab, and moves Reports into the lower Governance tab row beside Forums, Sources, and Records. The PMO rail label and governance drawer eyebrows now use My Workspace terminology.
- Added the PMO Figma front door as `PmoFrontdoorComponent` with typed fixture/config data in `pmo-frontdoor.data.ts`; the PMO shell now opens on this front door and switches into the existing governance workspace from rail/action-card events while keeping PMO outside the PM console monolith.
- Removed PMO Governance pagination/page-size footers from workspace and forum-detail register surfaces; governance tables now rely on scrollable table containers instead of Show entries / Previous / Next controls.
- Changed the PMO forum detail Overview tab so the Forum information, Forum Identity, and Ownership cards stack vertically instead of using a right-side metadata column.
- Made the PMO forum detail Overview tab editable using the shared `PmConsoleFieldComponent`, status pill, and Lucide icon wrapper; saved Overview changes now update the shell-owned forum collection and persist when the drawer is closed and reopened, and the forum-detail tab rail is left-aligned.
- Added the forum-detail Add Issue side drawer. `pmo-governance-issue-drawer.component.ts` owns the issue, description, priority, resolution, status, owner, and three date fields with Tasama form styling and typed draft/options in `pmo-governance-workspace.data.ts`.
- Added the PMO Reports Create Report side drawer. `pmo-governance-report-drawer.component.ts` reuses the shared plan-drawer shell, presents the supplied report-template fields with Tasama styling, and saves created templates back into the Reports table using typed report draft options from `pmo-governance-workspace.data.ts`.
- Added the forum-detail Add Risks to Watchlist side drawer. `pmo-governance-watchlist-risk-drawer.component.ts` owns the risk-category tabs, search, scroll-only selectable risk table, selected-count footer chip, and typed picker fixtures, while `PmConsolePlanDrawerComponent` now supports wider picker drawers and footer prefix content.
- Simplified the PMO Reports tab header and empty register surface: removed the Published badge and More header action, replaced the old Show/Search controls with the shared expandable search next to the right-aligned Create Report CTA, and removed bottom report pagination while there is no report data.
- Updated the forum-detail Add Source drawer variant with Add Source/Add Existing Source radio controls and a blank Type select state while preserving the shared Tasama drawer and main Sources register behavior.
- Reworked the PMO forum detail Overview tab into `PmoGovernanceForumOverviewComponent`, replacing faux read-only input boxes with compact Tasama read-only sections, existing icon/status-pill primitives, and responsive metadata/ownership panels.
- Added a PMO Governance forum Create Meeting side drawer. `pmo-governance-meeting-drawer.component.ts` owns Meeting Name and required Meeting Date fields, uses the shared plan drawer shell and Tasama form styling, and is launched from the forum-detail Meetings tab.
- Updated `PmConsoleRowActionMenuComponent` so the shared trigger uses the PM table plain vertical-dots treatment by default, preventing PMO governance tables from showing rounded icon-button outlines around row menus.
- Removed chevron-only open action columns and standalone row edit/delete controls from PMO governance tables. Main workspace tables and forum-detail shared register tables now use the shared three-dot row action menu for row-level view/edit/delete actions, and the record detail header no longer exposes a separate Edit Record button.
- Added shared `PmConsoleExpandableSearchComponent`, wired it into PMO governance register toolbars and the shared register table workspace search, and reordered shared/PMO toolbar actions so primary add buttons remain the rightmost control.
- Added a PMO Governance Workspace Add Record side drawer. `pmo-governance-record-drawer.component.ts` owns forum, meeting, title, type, owner, due date, and optional detail fields, uses Tasama-styled radio controls for Action/Decision, and is launched from both the main Records register and forum-detail Records tab.
- Added the PMO forum detail Overview tab as the first forum tab and moved forum profile fields into typed forum fixtures; removed the top-level Edit Forum Details action from the forum detail drawer.
- Removed the non-reports `View Info` action and the favorite/comment utility buttons from the PMO Governance Workspace page header; the Reports header no longer carries status or utility actions.
- Added a PMO Governance Workspace Add Source side drawer. `pmo-governance-source-drawer.component.ts` owns the required Type and Source Name fields, uses Lucide icons through `pmConsoleIcon`, and is launched from both the main Sources register and forum-detail Sources tab.
- Reworked the PMO forum detail drawer tables to reuse `PmConsoleRegisterTableComponent` across Meetings, Sources, Records, and Watchlist; added shared table support for wrapped/icon text cells and expanded row-detail templates; and aligned the Watchlist category rail with the PM create-report drawer's left section navigation.
- Changed the PMO Governance Workspace forum detail interaction from full-page replacement to a right-side drawer. `pmo-governance-forum-detail-drawer.component.ts` now owns the selected forum tabs and keeps the Home register visible behind the overlay.
- Promoted the selected forum detail drawer mount from the workspace content frame to `PmoGovernanceShellComponent`, so the backdrop covers the header and left rail and the panel uses the full viewport height.
- Added a PMO Governance Workspace Add New Forum drawer. The drawer is feature-scoped in `pmo-governance-forum-drawer.component.ts`, reuses the shared `PmConsolePlanDrawerComponent`, and takes typed defaults/options from `pmo-governance-workspace.data.ts`. The shared plan drawer layer now sits above the AI agent launcher so drawer footers remain clickable.
- Added PMO governance record-detail documentation: the PMO persona now owns a governance shell/workspace, and All Records can open a Tasama-styled record detail page.
- Documented `pmo-governance-record-detail.component.ts`, `pmoGovernanceRecordDetails`, and `pmoGovernanceRecordDetailFor(record)` as the typed fixture/detail pattern for governance records.
- Changed the PMO governance record detail interaction from full-page replacement to a right-side drawer so the All Records register remains visible behind the detail overlay.
- Moved the PMO governance record-detail drawer overlay outside the workspace card frame so it spans the full viewport and dims the top bar and left navigation as well as the content area.
- Reworked `PmoGovernanceRecordDetailDrawerComponent` to follow the existing PMO forum-detail side-drawer pattern: 1040px drawer width cap, grey header, compact tabs, and card-based Overview/Relationships/Activity sections, replacing the oversized record-detail drawer pass.
- Tuned the PMO Governance Workspace forum register typography to lighter table/body weights, kept headers one step stronger, and replaced the forum pagination footer with a scrollable table area.

2026-05-25:

- Created `BIBLE.md` as the project-level handoff, memory, architecture, and AI-agent restart guide.
- Documented current Angular architecture, persona entry flow, PM front-door meaning, PM onboarding states, PM console structure, Executive structure, shared component inventory, design system references, known technical debt, and required update protocol.
- Added the rule that meaningful project changes must update this file in the same change set.
