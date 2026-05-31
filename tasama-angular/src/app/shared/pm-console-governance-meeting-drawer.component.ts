import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from './pm-console-icon.component';

interface Attendee {
  name: string;
  initials: string;
  role: string;
}

interface WatchlistItem {
  id: number;
  title: string;
  description: string;
  linkText: string;
}

const ATTENDEE_POOL: Attendee[] = [
  { name: 'Muna Hassan', initials: 'MH', role: 'Delivery Office' },
  { name: 'Ahmed Hassan', initials: 'AH', role: 'Program Manager' },
  { name: 'Sarah Al Saud', initials: 'SA', role: 'PMO Specialist' },
  { name: 'Fatima Qahtani', initials: 'FQ', role: 'Project Manager' },
  { name: 'Osman Khan', initials: 'OK', role: 'Portfolio Manager' },
  { name: 'Nadia Hossain', initials: 'NH', role: 'Business Analyst' },
  { name: 'Jasmine Smith', initials: 'JS', role: 'Technical Sponsor' },
  { name: 'David Garcia', initials: 'DG', role: 'Operations Director' },
];

const WATCHLIST_POOL: WatchlistItem[] = [
  { id: 1, title: 'Critical path dependency slip in Vision 2030', description: 'Review potential mitigations for NEOM integration and resource constraints.', linkText: 'View Project' },
  { id: 2, title: 'Benefits realization tracking for Smart City Alpha', description: 'Track platform adoption rates and stakeholder readiness metrics.', linkText: 'View Program' },
  { id: 3, title: 'Overdue budget baseline approval for UAE Research Map', description: 'Resolve CAPEX baseline allocation variances before the weekly review.', linkText: 'View Risk' },
  { id: 4, title: 'Sponsor evidence pack submission status', description: 'Ensure sponsor decision notes are attached for the next stagegate milestone.', linkText: 'View Issue' },
  { id: 5, title: 'Status report review for Standalone initiatives', description: 'Analyze monthly reporting completion rates across standalone projects.', linkText: 'View Project' },
  { id: 6, title: 'Change request assessment for Vision 2030', description: 'Track scope extensions and baseline adjustments requested by the delivery head.', linkText: 'View Program' },
  { id: 7, title: 'Total active initiatives across sectors', description: 'Agreement on current portfolio status and areas requiring intervention.', linkText: 'View Project' },
  { id: 8, title: 'Stakeholder alignment on NEOM roadmap', description: 'Review milestone progress and cross-program dependencies with external partners.', linkText: 'View Program' }
];

@Component({
  selector: 'app-pm-console-governance-meeting-drawer',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gov-meeting-drawer-shell" aria-live="polite">
      <button class="gov-meeting-drawer-backdrop" type="button" (click)="close.emit()" aria-label="Close meeting drawer"></button>
      <aside class="gov-meeting-drawer" role="dialog" aria-modal="true" aria-label="Governance Meeting Details">
        <div class="drawer-inner">
          <header class="gov-meeting-header">
            <div class="gov-header-copy">
              <div class="header-top-row">
                <span class="eyebrow-text">UPCOMING EVENT</span>
                <span class="committee-pill">Governance Committee</span>
              </div>
              <h2 class="meeting-title">{{ eventTitle }}</h2>
              <div class="meta-row">
                <span class="meta-label">Forum Name:</span>
                <strong class="meta-value">{{ forumName }}</strong>
                <span class="meta-label">Category:</span>
                <span class="category-pill">Business Excellence</span>
              </div>
            </div>
            <div class="drawer-header-actions">
              <button type="button" class="drawer-icon-btn" aria-label="Expand governance drawer">
                <span pmConsoleIcon="maximize-2" aria-hidden="true"></span>
              </button>
              <button type="button" class="drawer-icon-btn" aria-label="Close governance drawer" (click)="close.emit()">
                <span pmConsoleIcon="x" aria-hidden="true"></span>
              </button>
            </div>
          </header>

          <section class="drawer-body">
            <!-- Meeting Details Card -->
            <div class="meeting-card">
              <div class="card-header">
                <div class="card-title-group">
                  <span pmConsoleIcon="calendar" class="card-icon" aria-hidden="true"></span>
                  <h3 class="card-title">Meeting Details</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Toggle meeting details" (click)="toggleSection('meeting')">
                  <span [pmConsoleIcon]="isSectionExpanded('meeting') ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                </button>
              </div>

              @if (isSectionExpanded('meeting')) {
              <div class="meeting-grid">
                <div class="grid-item">
                  <span class="grid-label">Meeting Time</span>
                  <strong class="grid-value">2:00 PM</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Meeting Date</span>
                  <strong class="grid-value">01/06/2026</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Type</span>
                  <strong class="grid-value">In-person</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Location</span>
                  <strong class="grid-value">Conference Room 1</strong>
                </div>
              </div>

              <!-- Attendees Inner Card -->
              <div class="attendees-card">
                <div class="attendees-header">
                  <div class="attendees-title-group">
                    <div class="icon-square">
                      <span pmConsoleIcon="layout-grid" aria-hidden="true"></span>
                    </div>
                    <div>
                      <h4 class="attendees-title">Attendees</h4>
                      <p class="attendees-desc">List of meeting attendees</p>
                    </div>
                  </div>
                  <span class="attendees-badge">{{ attendees.length }} attendees</span>
                </div>
                <table class="attendees-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (att of attendees; track $index) {
                      <tr>
                        <td>
                          <div class="user-cell">
                            <span class="avatar">{{ att.initials }}</span>
                            <span class="user-name">{{ att.name }}</span>
                          </div>
                        </td>
                        <td>{{ att.role }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              }
            </div>

            <!-- Forum Agenda / Watchlist -->
            <div class="agenda-section">
              <div class="card-header">
                <div class="card-title-group">
                  <span pmConsoleIcon="calendar-days" class="card-icon" aria-hidden="true"></span>
                  <h3 class="card-title">Forum Agenda / Watchlist <span class="header-count">| {{ watchlistItems.length }} items</span></h3>
                </div>
                <button type="button" class="collapse-btn" aria-label="Toggle agenda" (click)="toggleSection('agenda')">
                  <span [pmConsoleIcon]="isSectionExpanded('agenda') ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                </button>
              </div>

              @if (isSectionExpanded('agenda')) {
              <div class="agenda-grid">
                @for (item of watchlistItems; track item.id) {
                  <div class="agenda-card">
                    <span class="agenda-eyebrow">AGENDA ITEM {{ item.id }}</span>
                    <h4 class="agenda-title">{{ item.title }}</h4>
                    <p class="agenda-desc">{{ item.description }}</p>
                    <a href="#" class="agenda-link">{{ item.linkText }} <span pmConsoleIcon="arrow-right" aria-hidden="true"></span></a>
                  </div>
                }
              </div>
              }
            </div>
          </section>
        </div>
      </aside>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      :host ::ng-deep .icon {
        color: #10069f !important;
      }

      .gov-meeting-drawer-shell {
        inset: 0;
        isolation: isolate;
        pointer-events: none;
        position: fixed;
        z-index: 1000;
      }

      .gov-meeting-drawer-backdrop {
        appearance: none;
        background: rgba(11, 11, 11, 0.4);
        border: none;
        inset: 0;
        opacity: 1;
        pointer-events: auto;
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        cursor: default;
      }

      .gov-meeting-drawer {
        background: var(--surface-default, #ffffff);
        box-shadow: -22px 0 50px rgba(25, 33, 61, 0.18);
        display: flex;
        flex-direction: column;
        height: 100%;
        pointer-events: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: clamp(560px, 50vw, 720px);
        max-width: calc(100vw - 72px);
      }

      .drawer-inner {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        background-color: #f7f7fc;
      }

      /* Header */
      .gov-meeting-header {
        align-items: flex-start;
        background-color: #f7f7fc;
        border-bottom: 1px solid #dddddd;
        display: flex;
        gap: clamp(16px, 2vw, 24px);
        justify-content: space-between;
        padding: clamp(20px, 2vw, 24px);
      }

      .gov-header-copy {
        display: grid;
        flex: 1 1 auto;
        gap: clamp(8px, 1vw, 10px);
        min-width: 0;
      }

      .drawer-header-actions {
        align-items: center;
        display: flex;
        flex: 0 0 auto;
        gap: 12px;
      }

      .drawer-icon-btn {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        color: #10069f;
        cursor: pointer;
        display: inline-flex;
        height: 32px;
        justify-content: center;
        padding: 0;
        width: 32px;
      }

      .drawer-icon-btn .icon {
        height: 18px;
        width: 18px;
      }

      .header-top-row {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 0;
        min-width: 0;
      }

      .eyebrow-text {
        color: #10069f;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      .committee-pill {
        background: rgba(52, 84, 196, 0.1);
        border-radius: 12px;
        color: #3454c4;
        font-size: 11px;
        font-weight: 300;
        max-width: min(260px, 100%);
        overflow: hidden;
        padding: 4px 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .meeting-title {
        color: #202633;
        font-size: clamp(18px, 1.45vw, 20px);
        font-weight: 600;
        line-height: 1.16;
        margin: 0;
        max-width: 100%;
        overflow-wrap: break-word;
      }

      .meta-row {
        align-items: center;
        display: grid;
        grid-template-columns: max-content minmax(0, 1fr) max-content max-content;
        gap: 8px;
        font-size: clamp(11px, 1vw, 13px);
        max-width: 100%;
        min-width: 0;
      }

      .meta-label {
        color: #6b7280;
        white-space: nowrap;
      }

      .meta-value {
        color: #374151;
        font-weight: 600;
        margin-right: clamp(8px, 1.2vw, 16px);
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .category-pill {
        background: #ebeaf7;
        border-radius: 999px;
        color: #10069f;
        font-size: 12px;
        font-weight: 300;
        max-width: min(270px, 22vw);
        overflow: hidden;
        padding: 4px 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* Body */
      .drawer-body {
        background: #f7f7fc;
        padding: 16px 24px 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      /* Cards */
      .meeting-card,
      .agenda-section {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 2px 2px rgba(1, 10, 15, 0.08);
        border: 1px solid #f1f5f9;
        padding: 16px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0;
      }

      .card-title-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .card-icon {
        color: #10069f;
      }

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }

      .header-count {
        color: #6b7280;
        font-weight: 400;
      }

      .info-icon {
        color: #10069f;
        cursor: pointer;
      }

      .collapse-btn {
        background: none;
        border: 1px solid #e5e7eb;
        border-radius: 50%;
        color: #10069f;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
      }

      /* Grid */
      .meeting-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-top: 16px;
        margin-bottom: 24px;
      }

      .grid-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .grid-label {
        color: #6b7280;
        font-size: 12px;
      }

      .grid-value {
        color: #374151;
        font-size: 14px;
        font-weight: 300;
      }

      /* Attendees Card */
      .attendees-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
      }

      .attendees-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        background: #f8fafc;
      }

      .attendees-title-group {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .icon-square {
        background: #ebeaf7;
        color: #10069f;
        border-radius: 8px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .attendees-title {
        margin: 0 0 4px;
        font-size: 14px;
        font-weight: 600;
        color: #111827;
      }

      .attendees-desc {
        margin: 0;
        font-size: 12px;
        color: #6b7280;
      }

      .attendees-badge {
        background: #f1f5f9;
        color: #475569;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 999px;
      }

      .attendees-table {
        width: 100%;
        border-collapse: collapse;
      }

      .attendees-table th {
        text-align: left;
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
        padding: 12px 16px;
        background: #f8fafc;
        border-bottom: 1px solid #e5e7eb;
      }

      .attendees-table td {
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 13px;
        color: #4b5563;
      }

      .attendees-table tr:last-child td {
        border-bottom: none;
      }

      .user-cell {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .avatar {
        background: #ebeaf7;
        color: #10069f;
        font-size: 11px;
        font-weight: 600;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-name {
        color: #374151;
      }

      /* Agenda Grid */
      .agenda-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 24px;
      }

      .agenda-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        display: flex;
        flex-direction: column;
      }

      .agenda-eyebrow {
        color: #9ca3af;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }

      .agenda-title {
        color: #111827;
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 12px;
        line-height: 1.4;
      }

      .agenda-desc {
        color: #6b7280;
        font-size: 13px;
        margin: 0 0 16px;
        line-height: 1.5;
        flex-grow: 1;
      }

      .agenda-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: #10069f;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
      }

      .agenda-link:hover {
        text-decoration: underline;
      }

      @media (max-width: 1180px) {
        .gov-meeting-drawer {
          width: min(720px, calc(100vw - 48px));
          max-width: calc(100vw - 48px);
        }

        .category-pill {
          max-width: min(240px, 28vw);
        }
      }

      @media (max-width: 760px) {
        .gov-meeting-drawer {
          width: 100vw;
          max-width: 100vw;
        }

        .gov-meeting-header {
          padding: 18px;
        }

        .meta-row {
          grid-template-columns: max-content minmax(0, 1fr);
        }

        .category-pill {
          max-width: 100%;
        }

        .drawer-body {
          padding: 14px 18px 20px;
        }
      }
    `
  ]
})
export class PmConsoleGovernanceMeetingDrawerComponent implements OnInit {
  @Input() eventTitle = 'Annual Performance Review';
  @Input() forumName = 'Audit Committee';
  @Input() statusLabel = 'Upcoming';
  @Output() close = new EventEmitter<void>();

  private readonly expandedSections = new Set<string>(['meeting', 'agenda']);

  attendees: Attendee[] = [];
  watchlistItems: WatchlistItem[] = [];

  ngOnInit(): void {
    this.randomizeAttendees();
    this.randomizeWatchlist();
  }

  randomizeAttendees(): void {
    const shuffled = [...ATTENDEE_POOL].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 3) + 4; // 4 to 6 attendees
    this.attendees = shuffled.slice(0, count);
  }

  randomizeWatchlist(): void {
    const shuffled = [...WATCHLIST_POOL].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);
    this.watchlistItems = selected.map((item, index) => ({
      ...item,
      id: index + 1
    }));
  }

  isSectionExpanded(section: string): boolean {
    return this.expandedSections.has(section);
  }

  toggleSection(section: string): void {
    if (this.expandedSections.has(section)) {
      this.expandedSections.delete(section);
    } else {
      this.expandedSections.add(section);
    }
  }
}
