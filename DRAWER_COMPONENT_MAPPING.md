# PMO Calendar Drawers: Component Mapping
## PMO-calender-changes Screenshots → Main-Design-Test Components

---

## Overview

Based on the screenshots you provided from **PMO-calender-changes**, I've identified and mapped the drawer components across both branches.

---

## Screenshot 1: Project Plan Drawer

### What You See
```
┌─────────────────────────────────────────────┐
│ REVIEW ACTION  |  Project Plan              │ ✕
│                                             │
│ Sovereign Cloud Gateway Infrastructure      │
│ Review Sovereign Cloud Gateway baseline...  │
│                                             │
│ 📋 Project Profile                    [∨]  │
│ ├─ Project name: Sovereign Cloud...         │
│ ├─ Category: Research & Development         │
│ ├─ Business Unit: Research Office           │
│ ├─ PMO Contact: PMO Desk                    │
│ └─ Project Manager: MH Muna Hassan          │
│                                             │
│ 🎯 Purpose and outcome              [∨]    │
│ 📅 Dates and scope                  [∨]    │
│ 💰 Budget baseline                  [∨]    │
│ ⚠️  Risks                            [∨]    │
│                                             │
│ [Cancel]  [More actions ▼]  [Approve]      │
└─────────────────────────────────────────────┘
```

### Components in PMO-calender-changes
**File**: `pm-console-plan-drawer.component.ts`

**Selector**: `app-pm-console-plan-drawer`

**Features**:
- Base plan drawer container
- Supports content projection via `<ng-content>`
- Header with title and close button
- Body section for content
- Footer with action buttons

### Components in Main-Design-Test
**File**: `shared/pm-console-plan-review-drawer.component.ts`

**Selector**: `app-pm-console-plan-review-drawer`

**Features**:
- Enhanced plan review drawer
- Shows project profile details
- Collapsible sections (Purpose, Dates, Budget, Risks)
- Review/approval workflow
- Action buttons (Cancel, More actions, Approve)

### Key Difference
- **PMO-calender-changes**: Generic base drawer
- **Main-Design-Test**: Specialized review drawer with specific sections

---

## Screenshot 2: Governance Committee Drawer

### What You See
```
┌─────────────────────────────────────────────┐
│ UPCOMING EVENT  |  Governance Committee  ✕  │
│                                             │
│ Convene Micro-segmentation Firewall...      │
│ governance committee                        │
│                                             │
│ Forum Name: Micro-segmentation Firewall... │
│ Category: Business Excellence               │
│                                             │
│ 📅 Meeting Details                  [∨]    │
│ ├─ Meeting Time: 2:00 PM                    │
│ ├─ Meeting Date: 01/06/2026                 │
│ ├─ Type: In-person                          │
│ └─ Location: Conference Room 1              │
│                                             │
│ 👥 Attendees  (List of 5 attendees) [5]    │
│ ├─ MH Muna Hassan          Delivery Office │
│ ├─ MH Muna Hassan          Delivery Office │
│ ├─ MH Muna Hassan          Delivery Office │
│ ├─ MH Muna Hassan          Delivery Office │
│ └─ MH Muna Hassan          Delivery Office │
│                                             │
│ 📋 Forum Agenda / Watchlist  [4 items]  [∨]│
│ ├─ Total active initiatives...              │
│ └─ Total active initiatives...              │
│                                             │
│ [Cancel]  [More actions ▼]  [Approve]      │
└─────────────────────────────────────────────┘
```

### Components in PMO-calender-changes
**File**: `pmo-governance-forum-detail-drawer.component.ts`

**Selector**: `app-pmo-governance-forum-detail-drawer`

**Features**:
- Detail view for governance forums
- Shows forum overview
- Tabbed interface for different views
- Meeting management
- Issue tracking
- Record management
- Source management
- Watchlist management

**Child Components**:
- `PmoGovernanceMeetingDrawerComponent` - Meeting creation/editing
- `PmoGovernanceIssueDrawerComponent` - Issue management
- `PmoGovernanceRecordDrawerComponent` - Record management
- `PmoGovernanceSourceDrawerComponent` - Source management
- `PmoGovernanceWatchlistRiskDrawerComponent` - Watchlist management

### Components in Main-Design-Test
**File**: `pmo-governance-forum-detail-drawer.component.ts` (same)

**Selector**: `app-pmo-governance-forum-detail-drawer`

**Features**: Same as PMO-calender-changes, but with:
- Enhanced integration with calendar
- Click handlers wired from calendar items
- Full detail views pre-populated
- Workflow integration

---

## Component Hierarchy

### PMO-calender-changes
```
Calendar Item Click
    ↓
pm-console-plan-drawer
├─ Base container
├─ Header
├─ Body (ng-content)
└─ Footer (buttons)

OR

pmo-governance-forum-detail-drawer
├─ Forum overview
├─ Tabs (Meetings, Issues, Records, Sources, Watchlist)
├─ Selected tab content
└─ Action buttons
```

### Main-Design-Test
```
Calendar Item Click
    ↓ (click handler)
    ↓
pm-console-plan-review-drawer
├─ Project Profile section (collapsible)
├─ Purpose and outcome (collapsible)
├─ Dates and scope (collapsible)
├─ Budget baseline (collapsible)
├─ Risks section (collapsible)
└─ Action buttons (Approve/Cancel)

OR

pmo-governance-forum-detail-drawer
├─ Forum overview with meeting details
├─ Attendees list
├─ Forum Agenda/Watchlist
└─ Action buttons
```

---

## Detailed Component Comparison

### Plan Drawer Components

| Aspect | PMO-calender-changes | Main-Design-Test |
|--------|----------------------|------------------|
| **Component** | pm-console-plan-drawer | pm-console-plan-review-drawer |
| **Purpose** | Generic plan container | Specific plan review view |
| **Content** | Custom via ng-content | Pre-built sections |
| **Sections** | None (generic) | 5 collapsible sections |
| **Project Info** | Via projection | Built-in display |
| **Approval Flow** | Buttons only | Full review workflow |
| **Details Shown** | None by default | Project profile, budget, risks |

### Governance Drawer Components

| Aspect | PMO-calender-changes | Main-Design-Test |
|--------|----------------------|------------------|
| **Component** | pmo-governance-forum-detail-drawer | pmo-governance-forum-detail-drawer |
| **Forum Overview** | ✓ Yes | ✓ Yes |
| **Meeting Details** | Via child drawer | Integrated in overview |
| **Attendees** | Via meeting drawer | Direct in overview |
| **Agenda** | Via watchlist tab | Direct in overview |
| **Tabs** | Multiple (Meetings, Issues, etc.) | Configurable |
| **Integration** | Component-based | Calendar-integrated |

---

## Code Locations

### PMO-calender-changes
- **Plan Drawer Base**: `pm-console-plan-drawer.component.ts`
- **Governance Forum Detail**: `pmo-governance-forum-detail-drawer.component.ts`
- **Governance Meeting**: `pmo-governance-meeting-drawer.component.ts`

**Path**: `/tasama-angular/src/app/`

### Main-Design-Test
- **Plan Review Drawer**: `shared/pm-console-plan-review-drawer.component.ts`
- **Governance Forum Detail**: `pmo-governance-forum-detail-drawer.component.ts` (same)
- **Governance Meeting**: `shared/pm-console-governance-meeting-drawer.component.ts`

**Path**: `/tasama-angular/src/app/`

---

## Key Integration Points

### How Drawers Are Opened

**PMO-calender-changes**:
```typescript
// Click handler on calendar pill
onPillClick(item: CalendarItem) {
  if (item.type === 'plan') {
    // May navigate or do nothing
    // Drawers exist but not integrated
  }
  if (item.type === 'governance') {
    // May show detail drawer
    // Governance forum detail drawer available
  }
}
```

**Main-Design-Test**:
```typescript
// Explicit drawer opening logic
onPlanClick(item: CalendarItem) {
  this.selectedPlanItem = item;
  this.showPlanReviewDrawer = true;
}

onGovernanceClick(item: CalendarItem) {
  this.selectedForum = item;
  this.showForumDetailDrawer = true;
}
```

---

## Visual States in Screenshots

### Screenshot 1: Plan Review State
- Status: "REVIEW ACTION"
- Purpose: Review and approve project plan
- Data shown: Project profile, budget, risks
- Actions: Cancel, More options, Approve

### Screenshot 2: Governance Committee State
- Status: "UPCOMING EVENT"
- Purpose: View governance committee details
- Data shown: Forum info, meeting details, attendees, agenda
- Actions: Cancel, More options, Approve

---

## Component Selection Summary

### For Plan Items (Screenshot 1)
```
PMO-calender-changes:
└── pm-console-plan-drawer (generic)

Main-Design-Test:
└── pm-console-plan-review-drawer (specific review UI)
    ├─ Project Profile
    ├─ Purpose and outcome
    ├─ Dates and scope
    ├─ Budget baseline
    └─ Risks
```

### For Governance Items (Screenshot 2)
```
PMO-calender-changes:
└── pmo-governance-forum-detail-drawer
    ├─ Overview
    ├─ Meeting details
    ├─ Attendees
    └─ Agenda/Watchlist

Main-Design-Test:
└── pmo-governance-forum-detail-drawer
    ├─ Overview (same)
    ├─ Meeting details (same)
    ├─ Attendees (same)
    └─ Agenda/Watchlist (same)
```

---

## Conclusion

### PMO-calender-changes
Provides the **component building blocks**:
- Generic plan drawer base
- Specialized governance forum detail drawer
- Modular child components for meetings, issues, records, etc.

### Main-Design-Test
Implements **complete integration**:
- Adds specific review drawer for plans
- Wires governance drawers to calendar clicks
- Pre-populates data from calendar items
- Adds approval/action workflows

The **governance components are largely the same** between branches, but **plan handling differs significantly**:
- PMO-calender-changes: Base generic container
- Main-Design-Test: Specialized review interface with predefined sections

Both branches successfully render the drawers shown in your screenshots, but through different architectural approaches.
