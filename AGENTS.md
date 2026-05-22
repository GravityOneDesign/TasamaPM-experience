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

## Icon Rules

- Use Lucide icons for every icon in the system.
- Use the existing `pmConsoleIcon` wrapper for icons.
- Do not add inline SVG icons, emoji icons, or icon assets from another library unless there is a clear product/design reason.
- If a matching Lucide icon does not exist, choose the closest Lucide icon and keep that choice consistent everywhere the same concept appears.
- Icon-only buttons must have clear `aria-label` text.

## Spacing, Padding, And Layout Consistency

Spacing consistency is a high priority. Before handing back UI work, compare the changed screen against nearby tabs, cards, drawers, tables, and forms.

- Similar tabs must use the same content width, outer padding, top spacing after the tab bar, and vertical section gaps.
- Similar cards must use the same internal padding, border radius, header/body/footer spacing, and action alignment.
- A standard card should usually have equal padding on all four sides unless the Figma design clearly shows a different header/body structure.
- Similar form fields, table toolbars, action rows, and section headers must use the same gap values.
- Do not invent new arbitrary spacing values for one component. Reuse tokens or the closest established spacing pattern.
- If two screens use the same layout pattern, copy the same spacing structure before adjusting content-specific details.
- Avoid uneven CSS like `padding: 17px 23px 19px 21px` unless matching a verified Figma measurement.

## Card And Section Rules

- Cards of the same type must look like the same component family.
- Keep card radius, border, shadow, padding, and header treatment consistent across repeated card types.
- Do not place cards inside cards unless the design explicitly requires a nested surface.
- Page sections should align to the same grid and spacing rhythm within a tab.
- Empty states, tables, forms, and summary cards should align with the same left and right content edges.

## Typography Rules

- Use existing typography patterns for page titles, section titles, card titles, labels, helper text, table text, and captions.
- Do not introduce random font sizes, weights, line heights, or letter spacing for one-off components.
- Similar text roles must look the same across tabs and workflows.
- Make sure text fits its container on desktop and smaller widths without awkward wrapping or overlap.
- Do not use bold font weights in the UI. Use semi-bold at most, usually `font-weight: 600`.
- Do not use pure black (`#000`, `#000000`, or named `black`) anywhere in the UI.
- Use `#0b0b0b` for headings and high-emphasis title text.
- Use `#2f2f2f` for normal body text.

## Button And Control Rules

- Primary, secondary, ghost, danger, and icon-only buttons should have consistent height, radius, padding, icon size, and icon/text gap.
- Use icon-only buttons for compact actions when the icon is familiar and the `aria-label` is clear.
- Buttons with both icon and text should use a consistent icon position and gap.
- Reuse existing button/control classes or extract a reusable component before creating another one-off style.

## Component State Rules

Reusable components should handle the states users naturally expect:

- Default
- Hover
- Focus
- Disabled
- Loading, when relevant
- Empty, when relevant
- Error or validation feedback, when relevant

Focus states must remain visible and accessible.

## Responsive Rules

- Check meaningful UI changes on desktop and at least one narrower viewport when feasible.
- Make sure cards, drawers, tables, tab content, buttons, and long labels do not overlap or break the layout.
- Prefer stable dimensions and responsive constraints for repeated UI elements so hover states, loading text, icons, and labels do not shift the layout.

## Design Token Rules

- Use existing Tasama tokens for color, spacing, radius, shadow, typography, and motion whenever available.
- Add a new token only when the value is reusable and clearly required by the design.
- Avoid one-off CSS values when a token or existing component pattern already solves the need.

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

For meaningful UI work, also check:

- Icons use Lucide through `pmConsoleIcon`.
- Padding and gaps are consistent across similar cards, tabs, drawers, tables, and forms.
- Similar cards and sections use the same radius, border, shadow, header/body spacing, and alignment.
- Typography follows existing page, section, card, label, helper, and table patterns.
- Font weight does not exceed semi-bold, and pure black is not used.
- Colors, spacing, radius, shadow, typography, and motion come from tokens or established local patterns.
- Repeated visual markup has been extracted into a reusable component.
- Large static data, schemas, config, or mock records are not stored inside page components.
- The changed screen has been visually checked where feasible.
