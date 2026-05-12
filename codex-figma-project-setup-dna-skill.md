# Codex Skill: TASAMA Project Setup Screen DNA (Reference-Lock)

## Reference
- Figma file: `rxA1S4rfitko88kKepGXkP`
- Source screen: `115:52506` (`TASAMA PMO - Project Setup Screen / Rehab`)
- Goal: Apply this exact visual/structural treatment to sibling tab screens without changing business content.

---

## Objective
Use this skill when updating other Project Setup tab screens so they match the reference screen’s:
- layout architecture
- component styling
- field spacing and rhythm
- header/subheader treatment
- form/control behavior and icon usage

Preserve original feature intent and tab-specific data. Only normalize design quality and consistency.

---

## Non-Negotiable Rules

### 1) Canvas + shell
- Root frame must be `1440 x 900`.
- Root layout is horizontal:
  1. `PM Left Menu` width `52`
  2. `App Shell` width `1388`
- `App Shell` is vertical with fixed bands:
  1. Header: `50`
  2. Meta Bar: `48`
  3. Notice Bar: `32`
  4. Workspace: `770`

### 2) Workspace tri-column
- Workspace is horizontal with 3 regions:
  1. Left tab rail: `231`
  2. Main form area: `862`
  3. Support rail: `295`
- Keep this width split stable across all sibling tab screens.

### 3) Auto-layout and structure discipline
- Keep semantic hierarchy only (`screen > band > section > row > component`).
- Remove dummy wrappers (`Container`, `Frame ####`) unless they are required for:
  - component state,
  - spacing contract,
  - border/background treatment.
- No overlap, no clipping, no floating text/icons outside parent layout.

### 4) No fake icons
- Never use text glyphs for controls (`x`, `X`, `>`, `v`, etc.).
- Use proper icon instances/vectors (e.g., `chevron-down`, close icon, etc.).

### 5) Content integrity
- Do not change tab options, labels, or data meaning.
- Do not rename/replace business fields unless explicitly requested.
- This skill is visual and structural normalization, not information architecture rewrite.

---

## Visual DNA Tokens (from reference screen)

### Typography
- Family: `Montserrat`
- Primary usage:
  - Body/default: `12` Regular or Medium
  - Supporting/meta: `11` Regular/Medium
  - Tiny labels/badges: `10` Medium/SemiBold
  - Section title: `24` SemiBold
- Maintain readable line-height (`~135%` to `150%`).

### Color anchors
- Primary brand blue: `#10069F`
- Primary dark text: `#1D252D`
- Secondary text: `#595959`
- White: `#FFFFFF`
- Card border neutral: approx `#A6A6A647`
- Input border neutral: `#F3F3F3`
- Soft info background: `#E8F4FA`
- Warm neutral chip/bg accent: `#F0EBDF`
- Gold status accent: `#B59E5F`
- Success green text accent: `#173F35`

Use these values (or existing mapped variables) consistently.

---

## Component Recipes (must match)

### 1) Header pattern
- Header (`50` high), horizontal, padding `16/24`.
- Left: back link + divider + project name + project type.
- Right controls live in Meta Bar (not in floating frame).

### 2) Meta Bar pattern
- Height `48`, padding `8/24`, item spacing `32`.
- Stage/State/Plan each as label + small pill (`24` high).
- Right side: saved state + mode toggle + actions.
- Action buttons:
  - Top secondary (`Save draft`): `96x32`, radius `6`
  - Top primary (`Submit for review`): `144x32`, radius `6`

### 3) Notice / mode hint
- Height `32`, padding `8/24`, left dot indicator + one-line message.

### 4) Left tab rail
- Keep same left-tab visual design and spacing as this reference.
- Active item uses brand treatment.
- Section ordering and labels must stay aligned to each tab screen’s real content.

### 5) Form container
- Main form frame (`862` wide) with internal padding `32`.
- Vertical section rhythm:
  - Stepper (`28`)
  - Title block (`56`)
  - Guidance card (`86`)
  - Form grid rows
  - Footer actions (`40`)

### 6) Inputs and dropdowns
- Standard field frame:
  - width: fill available column
  - height: `38`
  - radius: `4`
  - fill: white
  - stroke: light neutral (`#F3F3F3`)
- Dropdowns are same input shell + chevron icon instance on right.
- No text arrow substitutes.

### 7) Form row geometry
- Two-column rows:
  - row width `798`
  - field widths `387 + 387`
  - column gap `24`
- Typical row heights:
  - `62` / `66` depending on label/auto-pill stack.

### 8) Pills/chips/badges
- Small pills generally `24` high, radius/capsule style.
- Stepper pills `28` high.
- Keep muted semantic fills for non-primary states.

### 9) Bottom actions
- Back (`88x40`) secondary.
- Save & exit (`112x40`) secondary.
- Continue (`184x40`) primary brand button.
- Keep them in one aligned action row; no overlap with content.

### 10) Support rail cards
- Right rail cards width `263`, radius `8`, white fill, light border.
- Card stack:
  - Completion
  - Mode
  - PIF Playbook
  - Help
- Internal padding `16`, clear vertical rhythm.

---

## Placement and Hierarchy Rules

### Header/Subheader placement
- Heading block always appears above form controls:
  1. H1/section title
  2. one-line descriptive subtext
- Guidance panel appears before first editable fields.

### Form sequence placement
- Keep field sequence logical:
  1. Identity/context fields
  2. classification/dropdowns
  3. ownership fields
  4. binary/governance questions
  5. add-item actions

### Rail placement
- Support rail starts aligned with top of main form band.
- Cards fill vertically with fixed spacing; no floating off-grid elements.

---

## Implementation Workflow (for sibling tab screens)
1. Lock shell dimensions and 3-column workspace widths.
2. Normalize top bands (Header, Meta, Notice) to reference structure.
3. Normalize left tab rail appearance and active state styling.
4. Rebuild main form rows using same field anatomy (38h input, 2-col row, 24 gap).
5. Replace fake icon text with proper icon instances.
6. Normalize action row and support rail cards.
7. QA pass for collisions/clipping/unaligned paddings.

---

## QA Checklist (Definition of Done)
- [ ] Screen remains `1440x900`.
- [ ] Left rail / main / support widths match `231 / 862 / 295`.
- [ ] No text-based icons for close/dropdown/etc.
- [ ] All fields visually match reference input/dropdown style.
- [ ] Header + subheader + guidance placement matches reference hierarchy.
- [ ] Button hierarchy (secondary vs primary) is consistent.
- [ ] Support rail cards match border/radius/padding treatment.
- [ ] No overlap, clipping, or stray absolute-position artifacts.
- [ ] Tab-specific data/content preserved.

---

## Reusable Prompt Wrapper
Use this prompt style for future runs:

> Apply `codex-figma-project-setup-dna-skill.md` to this TASAMA tab screen.  
> Keep all existing tab data/content unchanged, but match the reference DNA from `115:52506` for layout, form components, spacing, typography, header/subheader placement, support rail cards, and icon treatment.  
> Remove structural slop, keep auto-layout clean, and ensure there is no overlap or clipped text.

