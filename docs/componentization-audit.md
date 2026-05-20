# Tasama Componentization Audit

Last reviewed: 2026-05-20

## Current Situation

The Angular app has started componentization, but it is not complete.

Reusable components already exist in `tasama-angular/src/app/shared`, including:

- `pm-console-field.component.ts`
- `pm-console-date-field.component.ts`
- `pm-console-icon.component.ts`
- `pm-console-status-pill.component.ts`
- `pm-console-table-action.component.ts`
- `pm-console-toolbar.component.ts`
- `pm-console-row-action-menu.component.ts`
- `pm-console-register-table.component.ts`
- `pm-console-risk-matrix.component.ts`
- `pm-console-overview-cards.component.ts`
- `pm-console-project-profile-card.component.ts`
- `pm-console-agent-banner.component.ts`
- `pm-console-ai-guide-chip.component.ts`

Feature-level components also exist:

- `pm-console-login.component.ts`
- `pm-console-onboarding.component.ts`
- `pm-console-shell.component.ts`
- `pm-console-plan-drawer.component.ts`
- `pm-console-plan-empty-state.component.ts`
- `pm-console-plan-table.component.ts`
- `pm-console-report-drawer.component.ts`
- `pm-console-notifications.component.ts`

However, `pm-console-content.component.ts` is still the main concentration point. It contains a large inline template, page state, fixture data, table schemas, form state, formatting helpers, workflow logic, and many repeated view sections. This is the primary hardcoded-page risk.

## Answer: Are There Hardcoded Pages?

Yes. The most important hardcoded page is the PM console content component. The static prototype under `pm-frontdoor` is also hardcoded by design and should be treated as a reference/prototype, not the production architecture.

The Angular implementation is better than the prototype because some shared components have been extracted, but it still has hardcoded page-level data and markup patterns.

## Can We Achieve The Target Architecture?

Yes. The current code can be optimized without throwing it away. The safest path is incremental extraction:

1. Keep visual behavior stable.
2. Extract one repeated UI pattern at a time.
3. Move seed data and schemas into typed fixture/config files.
4. Promote broadly useful controls into shared atomic/molecular components.
5. Promote feature-specific sections into feature components.
6. Add tests around extracted logic as it becomes isolated.

## Recommended Target Structure

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
```

## Suggested Extraction Order

1. Data/config extraction
   Move project rows, register rows, PM101 cards, report sections, budget seed state, risk seed state, and change-request seed state out of `pm-console-content.component.ts`.

2. Atomic cleanup
   Standardize button, icon button, status pill, field, date field, money field, avatar, badge, and empty-state primitives.

3. Molecule extraction
   Extract metric cards, section headers, action-card rows, drawer headers, toolbar groups, filter controls, and table row action menus.

4. Organism extraction
   Extract workspace dashboard, PM101 hub, project plan section renderer, schedule/scope panel, budget panel, benefit panel, risk panel, issue panel, dependency panel, change-request panel, closure panel, and report workspace.

5. Page composition
   Convert `pm-console-content.component.ts` into a coordinator that selects which organism/page component to show and passes typed state.

## Definition Of Done For Future UI Work

- No new duplicated visual blocks.
- Existing shared components checked before creating new ones.
- New reusable visual patterns extracted immediately.
- No new large fixture arrays in page components.
- Figma tokens and documented design system values used where possible.
- Build or narrow verification run documented before handoff.

