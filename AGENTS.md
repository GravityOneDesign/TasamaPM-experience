# Tasama Codex Working Rules

These instructions apply to the whole repository. Read them before making any change.

## Product Goal

Tasama should be a structured, optimized, production-ready Angular codebase that matches supplied Figma designs closely while staying easy to extend. Prefer reusable component systems over one-off page markup.

## Component-First Workflow

Before implementing UI:

1. Search the existing component library in `tasama-angular/src/app/shared` and nearby feature components.
2. Reuse an existing component when it fits the Figma intent.
3. If a similar component exists but is too narrow, generalize it with typed inputs, outputs, and content projection instead of duplicating markup.
4. Create a new component only when no existing component can reasonably support the design.
5. When creating a new component, decide whether it is an atom, molecule, organism, or page-level shell before coding.

## Atomic Design Structure

Use this hierarchy:

- Atoms: buttons, icons, pills, fields, avatars, labels, date inputs, money inputs.
- Molecules: search bars, toolbar groups, status summaries, action menus, metric cards, form rows.
- Organisms: drawers, register tables, project cards, report sections, budget panels, risk profile panels.
- Pages/shells: route-level or major view containers only. Pages compose organisms and bind data; they should not contain repeated visual markup or large static datasets.

## Hardcoding Rules

Avoid hardcoded pages and copied UI blocks.

- Do not add large static arrays, table schemas, workflow data, or mock project data inside page components.
- Put demo/seed data in typed fixture files or services.
- Put calculations, formatting, and data transforms in typed utilities or services when they are reused.
- Keep page components focused on orchestration: selected state, layout composition, and calling services.
- If the same visual pattern appears twice, extract or reuse a component before adding the second copy.

## Angular Standards

- Use standalone Angular components and `ChangeDetectionStrategy.OnPush`.
- Keep inputs and outputs strongly typed.
- Prefer pure helper functions for formatting/calculation logic.
- Avoid direct DOM access unless layout measurement or third-party integration truly requires it.
- Use Angular bindings instead of manual `innerHTML`.
- Do not introduce new framework dependencies without a clear reason.

## Styling And Figma Fidelity

- Match the supplied Figma design first; do not invent a different visual system.
- Use existing design tokens from `tokens/tasama.tokens.json`, `tokens/tasama.css`, and documented patterns in `docs/tasama-design-system.md`.
- Add or extend tokens only when the design requires a reusable value that does not exist.
- Avoid adding more global CSS to `tasama-angular/src/styles.css` unless extracting existing global styles is out of scope.
- Prefer component-scoped class systems and reusable style primitives for new components.
- Before finalizing meaningful UI work, run the app and visually verify the changed screens where feasible.

## Refactoring Direction

When touching the PM console:

- Reduce the size and responsibility of `pm-console-content.component.ts`.
- Extract reusable sections into feature components instead of expanding the main component.
- Move seed data and config objects out of the main component.
- Preserve behavior and visual fidelity while extracting; refactor in small, verifiable slices.
- Do not rewrite the whole console in one pass unless explicitly requested.

## Quality Bar

Before handing work back:

- Run the narrowest relevant verification command.
- For Angular changes, prefer `npm run build` from `tasama-angular` once build stability is fixed.
- Mention any verification that could not be completed.
- Keep unrelated user changes intact.

