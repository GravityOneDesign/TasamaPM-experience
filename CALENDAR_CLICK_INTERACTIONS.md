# PMO Calendar Click Interactions Guide
## PMO-calender-changes Branch

---

## How to Access the Calendar

1. **Start the Application**:
   - Navigate to: `http://localhost:4202`
   - You should see the TASAMA login page

2. **Log In as PMO User**:
   - Persona: Select **"PMO"** from dropdown
   - Password: `123`
   - Click **Sign In**

3. **Navigate to Calendar**:
   - Click **"Manage My Work"** tab
   - You'll see: **"My Calendar"** with May 2026 calendar

---

## What You'll See in PMO-calender-changes

### Calendar View Layout

```
┌─────────────────────────────────────────────────────────┐
│ My Calendar                              May 2026       │
│ [May 2026 | 52 items this month]                        │
│                                                         │
│     Mon    Tue    Wed    Thu    Fri    Sat    Sun       │
│     27     28     29     30     1      2      3         │
│                                      [SR] [SR]          │
│     4      5      6      7      8      9      10        │
│                        [GC]                            │
│     11     12     13     14     15     16     17        │
│                        [B]     [PP]   [B]    [GC]       │
│     18     19     20     21     22     23     24        │
│     [CR]   [B]   [SR]          [PP]         [PP]        │
│     25     26     27     28     29     30     31        │
│     [CR]  [GC]                 [GC]   [PP]   [GC]       │
│                                      [PP]               │
└─────────────────────────────────────────────────────────┘

Legend:
[SR] = Status Report
[CR] = Change Request
[PP] = Project Plan
[GC] = Governance Committee
[B]  = Benefit
```

---

## Scenario 1: Clicking on a PROJECT PLAN Item

### Initial View
Calendar shows project plan items scattered throughout May (May 15, 16, 24, 29, 31)

### What Happens When You Click
**The PMO-calender-changes branch does NOT have plan drawer creation logic**

In this branch, clicking on plan items may:
- Show item details in a sidebar or panel
- OR navigate to a plan view
- OR show nothing (if no click handler is assigned)

**Note**: The plan drawer components (`pm-console-plan-drawer`) exist but are not integrated into the calendar's click handlers in this branch.

---

## Scenario 2: Clicking on a GOVERNANCE COMMITTEE Item

### Initial View
Calendar shows governance committee items on:
- May 7 (partial, shows "Governance co...")
- May 13 ("Governance comm")
- May 14 ("Governance comm")
- May 17 ("Governance co...")
- May 24 ("Governance comm")
- May 26 ("Governance comm")
- May 29 ("Governance co...")
- May 31 ("Governance...")

### What Happens When You Click

**Option A: If Drawers Are Integrated** (depends on implementation)

A side drawer would slide in from the RIGHT showing:

```
┌─────────────────────────────────────────────────────────────┐
│ Side Drawer (Slides in from right)                          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✕                                                       │ │
│ │ UPCOMING EVENT                                          │ │
│ │                                                         │ │
│ │ Convene [Project Name] governance committee            │ │
│ │                                                         │ │
│ │ Forum Name: Audit Committee                            │ │
│ │ Category: Business Excellence                          │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Meeting Details                                     │ │ │
│ │ ├─────────────────────────────────────────────────────┤ │ │
│ │ │ Meeting Time:   2:00 PM                            │ │ │
│ │ │ Meeting Date:   01/06/2026                         │ │ │
│ │ │ Type:           In-person                          │ │ │
│ │ │ Location:       Conference Room 1                  │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Attendees (5 attendees)                             │ │ │
│ │ ├─────────────────────────────────────────────────────┤ │ │
│ │ │ MH  Muna Hassan          Delivery Office           │ │ │
│ │ │ MH  Muna Hassan          Delivery Office           │ │ │
│ │ │ MH  Muna Hassan          Delivery Office           │ │ │
│ │ │ MH  Muna Hassan          Delivery Office           │ │ │
│ │ │ MH  Muna Hassan          Delivery Office           │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Governance Committee Agenda/Watchlist (4 items)     │ │ │
│ │ ├─────────────────────────────────────────────────────┤ │ │
│ │ │ AGENDA ITEM 1                                       │ │ │
│ │ │ Total active initiatives across sectors             │ │ │
│ │ │ Agreement on current portfolio status and areas     │ │ │
│ │ │ requiring intervention                              │ │ │
│ │ │ → View Project  → View Program                      │ │ │
│ │ │                                                     │ │ │
│ │ │ AGENDA ITEM 2                                       │ │ │
│ │ │ Total active initiatives across sectors             │ │ │
│ │ │ ...                                                 │ │ │
│ │ │ → View Project  → View Program                      │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ ┌──────────────────────┐  ┌──────────────────────┐   │ │
│ │ │      CANCEL          │  │      CLOSE           │   │ │
│ │ └──────────────────────┘  └──────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Option B: If No Handler Is Attached**
- Nothing happens (item is not clickable)
- OR navigates to a different view

---

## Key Differences: PMO-calender-changes vs Main-Design-Test

### PMO-calender-changes
- **Plan Items**: No click handler (components exist but not integrated)
- **Governance Items**: May show detail view OR no interaction
- **Drawer Components**: Exist as standalone (not wired to calendar)
- **Focus**: Component implementation only

### Main-Design-Test
- **Plan Items**: Click opens detail drawer
- **Governance Items**: Click opens governance committee detail drawer
- **Drawer Components**: Fully integrated with calendar interactions
- **Focus**: Complete user workflow

---

## Expected Interactions in PMO-calender-changes

### For Plan Items:
```
Calendar Item (Project Plan)
    ↓ click
    ↓
[No Handler or]
[Item Detail View or]
[Navigation to Plan View]
```

### For Governance Items:
```
Calendar Item (Governance Committee)
    ↓ click
    ↓
[No Handler or]
[Generic Item Detail or]
[Partial Detail View]
```

**Note**: The drawer components (`PmoGovernanceForumDrawerComponent`, `PmoGovernanceMeetingDrawerComponent`) exist in this branch but are likely NOT wired to the calendar click events.

---

## Components That Exist in PMO-calender-changes

### Available But Not Integrated:
1. **PmConsolePlanDrawerComponent**
   - Selector: `app-pm-console-plan-drawer`
   - Purpose: Base drawer for plan forms
   - Status: ✓ Implemented, ✗ Not used in calendar

2. **PmoGovernanceForumDrawerComponent**
   - Selector: `app-pmo-governance-forum-drawer`
   - Purpose: Create/edit governance forums
   - Status: ✓ Implemented, ✗ Not used in calendar clicks

3. **PmoGovernanceMeetingDrawerComponent**
   - Selector: `app-pmo-governance-meeting-drawer`
   - Purpose: Create governance meetings
   - Status: ✓ Implemented, ✗ Not used in calendar clicks

---

## How to Test This Yourself

### Step-by-Step:
1. Open browser to: `http://localhost:4202`
2. Login as PMO user (password: `123`)
3. Go to: **Manage My Work** → **My Calendar**
4. **Try clicking on these items**:
   - ✓ Click "Project Plan" on May 15
   - ✓ Click "Governance comm" on May 7
   - ✓ Click "Governance comm" on May 14
5. **Observe**:
   - Does anything happen?
   - Does a drawer open?
   - Does the view change?
   - Is it clickable at all?

### Expected Results in PMO-calender-changes:
- Likely: **No visible interaction** (components not integrated)
- Or: **Generic detail view** (if basic handler exists)
- Unlikely: **Full drawer with form** (unless integrated)

---

## Comparison: What Main-Design-Test Does

In **Main-Design-Test**, when you click:

### Plan Item:
1. Drawer opens from the right
2. Shows plan details
3. Has form fields for editing
4. Can submit or cancel

### Governance Item:
1. Governance committee drawer opens
2. Shows meeting details
3. Lists all attendees
4. Shows governance agenda/watchlist
5. Has action buttons

---

## Technical Note

The difference is in the **click handlers** and **routing logic**:

**PMO-calender-changes**:
```typescript
// Click handler likely missing or generic
<div (click)="genericHandler()">
  Governance Committee Item
</div>
```

**Main-Design-Test**:
```typescript
// Specific drawer opening logic
<div (click)="openGovernanceDrawer(item)">
  Governance Committee Item
</div>

openGovernanceDrawer(item) {
  this.selectedItem = item;
  this.showGovernanceDrawer = true;
}
```

---

## Summary

**PMO-calender-changes** is a **component library** focused on the drawer implementations themselves. The drawers exist and are functional as standalone components, but they are **NOT integrated** into the calendar's click event system.

To see the drawers in action, you would need to:
1. Manually trigger them in code
2. Or use them in a different context
3. Or integrate them yourself (which is what Main-Design-Test appears to have done)

**Main-Design-Test** completes this integration, making the drawers accessible through the calendar UI.

---

## Next Steps

**To capture live screenshots, you would need to**:
1. Have a headless browser or manual browser access
2. Click items and screenshot the results
3. Compare the behavior between branches

**Alternative**: Review the implementation code in `pm-console-content.component.ts` to see exactly how Main-Design-Test wires the drawers to calendar clicks.
