# Codex Skill: Figma Screen Rehabilitation (Tasama Workspace)

## Objective
Use this skill when a Figma screen was AI-generated and needs to be cleaned up without losing the original product intent.

Primary goals:
1. Preserve the original ideas/features/workflows.
2. Make the screen fully usable and human-readable.
3. Remove AI-slop structure and visual noise.
4. Enforce strict layout/typography/accessibility baseline rules.

---

## Non-Negotiable Rules

### 1) Frame and grid baseline
- Main screen frame size: `1440 x 900`.
- Use a consistent app grid: `12-column grid` on desktop.
- Use one grid system only across the screen.
- Align all major sections/cards to the grid.

### 2) Auto-layout requirements
- Everything must be auto-layouted.
- Vertical stacks must be `HUG` on height by default.
- Remove redundant wrapper frames (`Container`, `Frame 123`, etc.) if they do not add semantic layout value.
- No unnecessary nested frames inside the main screen hierarchy.
- Keep only meaningful semantic nesting (screen > section > card > row/content).

### 3) Spacing and sizing scale
- Use spacing scale only: `8, 16, 24, 32, 40, 48` (8pt system).
- Gaps must follow this scale.
- Padding must follow this scale.
- Padding values should be equal on all sides unless a clear layout reason exists.
- Do not use arbitrary values like `13`, `19`, `27`, etc.

### 4) Typography baseline
- Absolute minimum font size anywhere: `10px`.
- Minimum body text size: `12px`.
- Maintain readable line-height (typically 1.25–1.5 for body text).
- No clipped, truncated, or overlapping text.

### 5) Accessibility baseline
- Fix visible contrast issues (text, status chips, indicators, action buttons).
- Ensure status is never color-only if context label is missing.
- Ensure interactive elements are clearly discoverable and readable.
- Keep key information scannable at a glance.

---

## Visual/Content Cleanup Rules

### 1) Keep intent, remove slop
- Keep the same product ideas, sections, and actions from original.
- Remove generic AI filler language.
- Rewrite copy to be concise, product-realistic, and role-relevant.

### 2) Status communication
- Restore missing micro-signals (status chips, trend dots, due-state indicators, risk indicators, budget/schedule cues).
- Ensure chart widgets display real metrics (not decorative placeholders).

### 3) Special states
- Pending/not-started projects should have a distinct visual treatment (example: dashed border, muted surface, startup callout) while preserving layout consistency.

---

## Execution Order (Always Follow)
1. **Structure pass**  
   Normalize hierarchy, remove redundant wrappers, ensure semantic sections.

2. **Auto-layout pass**  
   Convert all containers/cards/rows to valid auto-layout with hug/fill behavior.

3. **Type and spacing pass**  
   Apply min font rules, line-height fixes, 8pt spacing scale, equal padding policy.

4. **State and data pass**  
   Restore status indicators, trends, and metric/chart clarity.

5. **Accessibility and overlap pass**  
   Fix contrast, collisions, clipping, overflow, and vertical hugging issues.

6. **Final verification pass**  
   Confirm no overlapping cards, no clipped text, no non-semantic nested wrappers, no rule violations.

---

## Definition of Done (Checklist)
- [ ] Screen is `1440 x 900`.
- [ ] One consistent desktop grid applied.
- [ ] All primary layout nodes are auto-layout.
- [ ] Vertical stacks/cards hug correctly.
- [ ] No overlapping cards or text collisions.
- [ ] No clipped/truncated critical text.
- [ ] No font below `10px`.
- [ ] No body text below `12px`.
- [ ] Gaps/padding use 8pt scale only.
- [ ] Padding values are equal by default.
- [ ] Redundant nested frames removed.
- [ ] Core ideas/features from original remain intact.
- [ ] Accessibility issues addressed (at least contrast + status clarity).

---

## Reusable Prompt Wrapper (for future Codex runs)
Use this exact style:

> Apply the rules from `docs/codex-figma-screen-rehab-skill.md` to this Figma screen.  
> Preserve original feature intent, fully auto-layout the screen, clean AI slop, enforce typography/spacing/accessibility rules, and fix overlaps/clipping.

