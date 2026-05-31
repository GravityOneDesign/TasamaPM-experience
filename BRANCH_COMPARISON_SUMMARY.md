# PMO Calendar Drawers: Branch Comparison Summary

## Overview

This document provides a comprehensive comparison of the PMO calendar drawer implementations across two branches:

- **Main-Design-Test** (Current): Enhanced, integrated version with calendar UI
- **PMO-calender-changes** (Original): Foundation components for drawers

---

## Visual Comparison

### Main-Design-Test: PMO User Calendar View

**Location**: PMO Console → Manage My Work → My Calendar

**What You'll See**:
- Full calendar grid for May 2026
- 52 scheduled items across the month
- Color-coded items:
  - **Governance Committees** (blue/purple)
  - **Project Plans** (green)
  - **Status Reports** (orange)
  - **Change Requests** (orange)
  - **Benefits** (green)

**Click Interaction**:
When you click on a governance committee item, a **detail drawer** slides in from the right showing:

```
┌─────────────────────────────────────┐
│ UPCOMING EVENT                       │ X
│ Convene [Project] governance         │
│ committee                            │
│                                      │
│ Forum Name: Audit Committee          │
│ Category: Business Excellence        │
│                                      │
│ ─ Meeting Details ────────────────── │
│ Meeting Time:    2:00 PM             │
│ Meeting Date:    01/06/2026          │
│ Type:            In-person           │
│ Location:        Conference Rm 1     │
│                                      │
│ ─ Attendees (5 attendees) ───────── │
│ MH Muna Hassan        Delivery Off.  │
│ MH Muna Hassan        Delivery Off.  │
│ MH Muna Hassan        Delivery Off.  │
│ MH Muna Hassan        Delivery Off.  │
│ MH Muna Hassan        Delivery Off.  │
│                                      │
│ ─ Governance Agenda/Watchlist ──── │
│ Total active initiatives across...   │
│ → View Project  → View Program       │
│                                      │
│                      [Close Button]  │
└─────────────────────────────────────┘
```

---

## Component Architecture

### PMO-calender-changes: Core Components

#### 1. Base Plan Drawer
**Purpose**: Reusable container for any plan/project form

```typescript
@Component({
  selector: 'app-pm-console-plan-drawer',
  // Styles: Fixed right-side drawer with animations
})
export class PmConsolePlanDrawerComponent {
  // Inputs: control appearance and behavior
  @Input() title: string;
  @Input() eyebrow: string;
  @Input() description: string;
  @Input() submitLabel: string = 'Save';
  @Input() cancelLabel: string = 'Cancel';
  @Input() submitDisabled: boolean = false;
  @Input() hideFooter: boolean = false;
  @Input() showDelete: boolean = false;

  // Outputs: communicate with parent
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<Event>();
  @Output() delete = new EventEmitter<Event>();
}
```

**Template Structure**:
```html
<div class="plan-entry-drawer-shell">
  <!-- Backdrop overlay -->
  <button class="backdrop"></button>
  
  <!-- Drawer container -->
  <aside class="plan-entry-drawer">
    <form>
      <!-- Header -->
      <header class="drawer-head">
        <div class="drawer-title">
          <span>{{ eyebrow }}</span>
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
        </div>
        <button (click)="close.emit()">✕</button>
      </header>

      <!-- Content area (accepts ng-content) -->
      <section class="drawer-body">
        <ng-content select="[planDrawerBody]"></ng-content>
      </section>

      <!-- Footer with buttons -->
      <footer class="drawer-footer">
        <button (click)="close.emit()">Cancel</button>
        <button type="submit">Save</button>
      </footer>
    </form>
  </aside>
</div>
```

#### 2. Governance Forum Drawer
**Purpose**: Create and manage governance forums

```typescript
@Component({
  selector: 'app-pmo-governance-forum-drawer',
  imports: [PmConsolePlanDrawerComponent, PmConsoleIconComponent]
})
export class PmoGovernanceForumDrawerComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<PmoGovernanceForumDraft>();

  draft = createPmoGovernanceForumDraft();
  
  // Methods: handle form updates
  updateForumName(event: Event): void { }
  updateType(event: Event): void { }
  updateCategory(event: Event): void { }
  updateDescription(event: Event): void { }
  updateChair(event: Event): void { }
  addPerson(field: 'secretariat' | 'members', event: Event): void { }
  removePerson(field: 'secretariat' | 'members', person: string): void { }
  toggleWorkflow(event: Event): void { }
  submitForum(event: Event): void { }
}
```

**Form Sections**:
```
┌─────────────────────────────────────────┐
│ Forum Information                       │
│ ┌──────────────────────────────────┐   │
│ │ Forum Name (required)    [input] │   │
│ │ Type                    [select] │   │
│ │ Category                [select] │   │
│ │ Forum Description      [textarea]│   │
│ └──────────────────────────────────┘   │
│                                         │
│ Forum Ownership                         │
│ ┌──────────────────────────────────┐   │
│ │ Forum Chair             [select] │   │
│ │ Forum Secretariat       [chips]  │   │
│ │ Forum Members           [chips]  │   │
│ │ Enable Workflow        [toggle] │   │
│ └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

#### 3. Governance Meeting Drawer
**Purpose**: Create governance meetings within forums

```typescript
@Component({
  selector: 'app-pmo-governance-meeting-drawer',
  imports: [PmConsolePlanDrawerComponent, PmConsoleIconComponent]
})
export class PmoGovernanceMeetingDrawerComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<PmoGovernanceMeetingDraft>();

  draft = createPmoGovernanceMeetingDraft();

  get canSave(): boolean {
    return Boolean(this.draft.meetingDate);
  }

  updateMeetingName(event: Event): void { }
  updateMeetingDate(event: Event): void { }
  submitMeeting(event: Event): void { }
}
```

**Form Fields**:
```
┌──────────────────────────────────┐
│ Meeting Details                  │
│ ┌────────────────────────────┐   │
│ │ Meeting Name    [input]    │   │
│ │ Meeting Date    [datepick] │   │
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```

---

## Styling Specifications

### Drawer Container
- **Position**: Fixed, right side (0 to 100vw)
- **Z-Index**: 1200 (top layer)
- **Width**: min(640px, calc(100vw - 72px))
- **Animation**: Slide in 0.3s with easing
- **Backdrop**: rgba(18, 24, 38, 0.24) semi-transparent overlay

### Header
- **Background**: #f7f7fc (light gray)
- **Border**: 1px solid #e4e7ef
- **Title Color**: #202633 (dark)
- **Eyebrow Color**: #10069f (brand blue)
- **Close Button**: Hover bg #eef1f7

### Body
- **Padding**: 18px 20px
- **Gap**: 20px between elements
- **Scrollable**: Yes (overflow-y: auto)

### Footer
- **Background**: rgba(255, 255, 255, 0.96)
- **Border**: 1px solid #e4e7ef
- **Button Submit**: #10069f bg, white text
- **Button Cancel**: White bg, border #e4e7ef
- **Button Delete**: Transparent, red border & text

### Responsive
- **Mobile Breakpoint**: 760px
- **Mobile Width**: 100vw
- **Mobile Padding**: 16px (reduced from 20px)

---

## Data Management

### Form Draft Objects

**PmoGovernanceForumDraft**:
```typescript
{
  forumName: string;
  type: 'Executive' | 'Operational' | 'Tactical';
  category: string;
  description: string;
  chair: string;
  secretariat: string[];
  members: string[];
  workflowEnabled: boolean;
}
```

**PmoGovernanceMeetingDraft**:
```typescript
{
  meetingName: string;
  meetingDate: string; // YYYY-MM-DD format
}
```

### Data Sources
- **Forum Options**: `pmoGovernanceForumFormOptions`
- **Meeting Drafts**: `createPmoGovernanceMeetingDraft()`
- **Location**: `./pmo-governance-workspace.data`

---

## Main-Design-Test Enhancements

### Additional Components (Parallel Versions)

#### Purpose
Maintain both original and calendar-integrated implementations without conflicts.

**Files Added**:
1. `pmo-calendar-plan-drawer.component.ts`
2. `pmo-calendar-governance-forum-drawer.component.ts`
3. `pmo-calendar-governance-meeting-drawer.component.ts`
4. `pmo-calendar-drawers.ts` (export module)

**Selectors**:
- Original: `app-pm-console-plan-drawer`
- Calendar: `app-pmo-calendar-plan-drawer`

**Import Path**:
```typescript
import {
  PmoCalendarPlanDrawerComponent,
  PmoCalendarGovernanceForumDrawerComponent,
  PmoCalendarGovernanceMeetingDrawerComponent
} from './pmo-calendar-drawers';
```

---

## Component Dependency Tree

### PMO-calender-changes
```
pmo-governance-forum-drawer
└── pm-console-plan-drawer
    └── pm-console-icon

pmo-governance-meeting-drawer
└── pm-console-plan-drawer
    └── pm-console-icon
```

### Main-Design-Test (With Calendar Versions)
```
Original components (above)
+
pmo-calendar-plan-drawer
├── pmo-calendar-governance-forum-drawer
└── pmo-calendar-governance-meeting-drawer
```

---

## Usage Examples

### Opening Forum Drawer
```typescript
export class GovernanceWorkspaceComponent {
  showForumDrawer = false;
  forumDrawer!: ViewChild<PmoGovernanceForumDrawerComponent>;

  openForumCreator(): void {
    this.showForumDrawer = true;
  }

  onForumSaved(forum: PmoGovernanceForumDraft): void {
    // Save forum data
    this.forumService.create(forum).subscribe(() => {
      this.showForumDrawer = false;
      this.refreshForums();
    });
  }
}
```

### Template
```html
<button (click)="openForumCreator()">
  Create Forum
</button>

@if (showForumDrawer) {
  <app-pmo-governance-forum-drawer
    (close)="showForumDrawer = false"
    (save)="onForumSaved($event)"
  ></app-pmo-governance-forum-drawer>
}
```

---

## Comparison Matrix

| Feature | PMO-calender-changes | Main-Design-Test |
|---------|----------------------|------------------|
| **Plan Drawer** | Base component | Base + calendar version |
| **Forum Drawer** | Creator form | Creator form + calendar version |
| **Meeting Drawer** | Creator form | Creator form + calendar version |
| **Calendar View** | Not included | Integrated |
| **Detail Drawer** | Not included | Shows meeting details |
| **Attendee List** | Form selection | Detail display |
| **Agenda Display** | Not included | Agenda/watchlist section |
| **Export Module** | No | Yes (pmo-calendar-drawers.ts) |
| **Component Count** | 3 | 6 (original + 3 calendar) |
| **Selector Prefix** | Original names | Original + `pmo-calendar-` |

---

## Key Differences

### PMO-calender-changes
✅ **Strengths**:
- Clean, focused implementation
- Single component per feature
- Minimal complexity
- Easy to understand and maintain
- Strong separation of concerns

❌ **Limitations**:
- No visual calendar integration
- Detail views require separate handling
- No attendee management display
- Limited to creation workflows

### Main-Design-Test
✅ **Strengths**:
- Full calendar visualization
- Integrated detail views
- Enhanced user experience
- Attendee management included
- Backward compatible
- Flexible parallel components

❌ **Considerations**:
- Larger component footprint
- More dependencies
- Additional complexity in organization

---

## Integration Points

### Calendar Integration (Main-Design-Test Only)
1. Click calendar item → Load meeting details
2. Detail drawer shows governance committee info
3. Attendee list populated from data
4. Agenda items displayed from governance workspace
5. Optional edit/create actions

### Form Integration (Both Branches)
1. User clicks "Create Forum" button
2. Forum drawer opens with empty form
3. User fills forum information
4. Selects secretariat and members
5. Toggles workflow option
6. Submits form
7. Parent component receives draft data

---

## Testing Scenarios

### PMO-calender-changes
- [ ] Forum drawer opens on create action
- [ ] Forum form validation works
- [ ] Chip select removes items
- [ ] Form submits with correct data
- [ ] Meeting drawer validates date
- [ ] Drawers close on cancel

### Main-Design-Test
- [ ] Calendar displays all items
- [ ] Clicking item opens detail drawer
- [ ] Attendee list shows correctly
- [ ] Governance agenda displays
- [ ] Create buttons work
- [ ] Responsive on mobile
- [ ] Animations smooth

---

## Deployment Notes

**PMO-calender-changes**:
- Self-contained components
- No external state required
- Can be deployed independently
- Minimal breaking changes risk

**Main-Design-Test**:
- Includes backward compatibility
- New components don't break old ones
- Full calendar requires data service
- May need additional styling assets

---

## Future Enhancements

**Potential Additions**:
1. Edit forum/meeting functionality
2. Delete confirmation dialogs
3. Archive attendance records
4. Email notifications
5. Calendar filtering options
6. Bulk operations on governance items
7. Governance analytics dashboard
8. Integration with external calendars

---

## Conclusion

Both branches provide solid implementations for governance calendar management:

- **Start with PMO-calender-changes** for clean, component-focused development
- **Use Main-Design-Test** for integrated calendar user experience
- **Leverage parallel components** for flexibility and backward compatibility

The drawer architecture is extensible and can support additional governance workflows and management features as needed.
