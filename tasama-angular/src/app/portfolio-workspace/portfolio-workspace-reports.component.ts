import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import { portfolioReports, reportsStats } from './portfolio-workspace.data';

type ReportsTab = 'awaiting' | 'scheduled' | 'past';

@Component({
  selector: 'app-portfolio-workspace-reports',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-reports-tab">

      <!-- Content Outlets -->
      <div class="reports-outlet-content animation-slide">
        <!-- Stats row (Image 3 Treatment) -->
        <div class="custom-stats-row">
          <!-- Card 1: Submitted Reports -->
          <article class="custom-stat-card">
            <span class="custom-stat-icon indigo-bg">
              <span [pmConsoleIcon]="'file-text'"></span>
            </span>
            <div class="custom-stat-info">
              <small class="custom-stat-label">Submitted Reports</small>
              <strong class="custom-stat-value">{{ reportsStats.submittedReports }}</strong>
            </div>
          </article>

          <!-- Card 2: Drafts -->
          <article class="custom-stat-card">
            <span class="custom-stat-icon indigo-bg">
              <span [pmConsoleIcon]="'pencil'"></span>
            </span>
            <div class="custom-stat-info">
              <small class="custom-stat-label">Drafts</small>
              <strong class="custom-stat-value">{{ reportsStats.drafts }}</strong>
            </div>
          </article>

          <!-- Card 3: Last Submitted -->
          <article class="custom-stat-card">
            <span class="custom-stat-icon indigo-bg">
              <span [pmConsoleIcon]="'calendar'"></span>
            </span>
            <div class="custom-stat-info">
              <small class="custom-stat-label">Last Submitted</small>
              <strong class="custom-stat-value">{{ reportsStats.lastSubmitted }}</strong>
            </div>
          </article>

          <!-- Card 4: Portfolio Health -->
          <article class="custom-stat-card health-card">
            <span class="custom-stat-icon orange-bg">
              <span [pmConsoleIcon]="'bar-chart-3'"></span>
            </span>
            <div class="custom-stat-info">
              <small class="custom-stat-label">Portfolio health</small>
              <strong class="custom-stat-value health-poor">{{ reportsStats.portfolioHealth }}</strong>
            </div>
            
            <div class="health-progress-section">
              <div class="segmented-progress-bar">
                <span class="progress-segment green" [style.width.%]="reportsStats.healthBreakdown.onTrack"></span>
                <span class="progress-segment orange" [style.width.%]="reportsStats.healthBreakdown.alert"></span>
                <span class="progress-segment red" [style.width.%]="reportsStats.healthBreakdown.offTrack"></span>
              </div>
              <div class="health-labels-row">
                <span class="health-label-item">On track <strong>{{ reportsStats.healthBreakdown.onTrack }}%</strong></span>
                <span class="health-label-item">Alert <strong>{{ reportsStats.healthBreakdown.alert }}%</strong></span>
                <span class="health-label-item">Off track <strong>{{ reportsStats.healthBreakdown.offTrack }}%</strong></span>
              </div>
            </div>
          </article>
        </div>

        <!-- Table filter toolbar (styled like register-toolbar) -->
        <div class="register-toolbar">
          <div class="toolbar-left">
            <span class="items-count">Items: {{ filteredPastReports.length }}</span>
          </div>
          <div class="toolbar-right">
            <div class="filter-dropdown-container">
              <button class="tb-btn" type="button" (click)="toggleFilterDropdown($event)" aria-label="Filter options">
                <span [pmConsoleIcon]="'filter'"></span>
                <span>Filter</span>
              </button>
              @if (showFilterDropdown) {
                <div class="filter-menu-popover">
                  <button class="filter-option" [class.is-active]="selectedStatusFilter === 'all'" type="button" (click)="setFilterStatus('all')">All</button>
                  <button class="filter-option" [class.is-active]="selectedStatusFilter === 'Submitted'" type="button" (click)="setFilterStatus('Submitted')">Submitted</button>
                  <button class="filter-option" [class.is-active]="selectedStatusFilter === 'Draft'" type="button" (click)="setFilterStatus('Draft')">Draft</button>
                </div>
              }
            </div>

            <button class="tb-btn" type="button" aria-label="Export">
              <span [pmConsoleIcon]="'download'"></span>
              <span>Export</span>
            </button>

            <button class="tb-btn primary-tb" type="button" style="display: inline-flex; align-items: center; gap: 6px;">
              <span [pmConsoleIcon]="'plus'"></span>
              <span>Create Report</span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="pm-project-table-scroll">
          <table class="pm-project-table">
            <thead>
              <tr>
                <th style="width: 22%">Report Name</th>
                <th style="width: 16%">Reporting Period</th>
                <th style="width: 13%">Reporting Status</th>
                <th style="width: 13%">Portfolio Status</th>
                <th style="width: 16%">Created By</th>
                <th style="width: 12%">Created At</th>
                <th style="width: 8%; text-align: right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (row of filteredPastReports; track row.name) {
                <tr>
                  <td><strong class="report-name-title">{{ row.name }}</strong></td>
                  <td class="period-text">{{ row.period }}</td>
                  <td>
                    <span [pmConsoleStatusPill]="row.status" baseClass="pm-table-row-status" [tone]="row.status === 'Submitted' ? 'green' : 'blue'"></span>
                  </td>
                  <td>
                    <span [pmConsoleStatusPill]="row.portfolioStatus" baseClass="pm-table-row-status" [tone]="row.portfolioStatus === 'On-Track' ? 'green' : (row.portfolioStatus === 'Off-Track' ? 'red' : 'amber')"></span>
                  </td>
                  <td>
                    <div class="avatar-cell">
                      <div class="avatar-circle" [ngStyle]="getCreatorAvatarStyles(row.createdBy)">
                        {{ getInitials(row.createdBy) }}
                      </div>
                      <span class="owner-name">{{ row.createdBy }}</span>
                    </div>
                  </td>
                  <td class="date-cell">{{ formatDate(row.createdAt) }}</td>
                  <td style="text-align: right; position: relative;">
                    <button class="action-menu-trigger" type="button" (click)="toggleRowMenu(row.name, $event)">
                      <span [pmConsoleIcon]="'more-horizontal'"></span>
                    </button>
                    @if (activeMenuRowName === row.name) {
                      <div class="row-menu-popover">
                        @if (row.status === 'Submitted') {
                          <button class="menu-item" type="button" (click)="onMenuOption(row.name, 'preview')">
                            <span [pmConsoleIcon]="'eye'" class="menu-item-icon text-primary"></span>
                            <span>Preview</span>
                          </button>
                        } @else if (row.status === 'Draft') {
                          <button class="menu-item" type="button" (click)="onMenuOption(row.name, 'edit')">
                            <span [pmConsoleIcon]="'pencil'" class="menu-item-icon text-warning"></span>
                            <span>Edit</span>
                          </button>
                          <button class="menu-item text-danger" type="button" (click)="onMenuOption(row.name, 'delete')">
                            <span [pmConsoleIcon]="'trash-2'" class="menu-item-icon"></span>
                            <span>Delete</span>
                          </button>
                        }
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .workspace-reports-tab {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 10px 0;
      animation: fadeIn 0.3s ease-out;
    }

    .reports-outlet-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Custom premium stats widgets (Image 3 Treatment) */
    .custom-stats-row {
      display: grid;
      grid-template-columns: 200px 200px 220px 1fr;
      gap: 16px;
      margin-bottom: 0;
    }

    .custom-stat-card {
      background: #ffffff;
      border: 1px solid #edf0f6;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(25, 33, 61, 0.04);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      height: 84px;
      box-sizing: border-box;
    }

    .custom-stat-card.health-card {
      gap: 20px;
    }

    .custom-stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 18px;
    }

    .custom-stat-icon.indigo-bg {
      background: #f0f0ff;
      color: #3b3bc4;
    }

    .custom-stat-icon.orange-bg {
      background: #FFF5E6;
      color: #E87722;
    }

    .custom-stat-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
    }

    .custom-stat-label {
      font-size: 12px;
      font-weight: 500;
      color: #707788;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .custom-stat-value {
      font-family: 'Montserrat', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }

    .custom-stat-value.health-poor {
      color: #E87722;
    }

    .health-progress-section {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 8px;
      justify-content: center;
      min-width: 250px;
    }

    .segmented-progress-bar {
      display: flex;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      background: #f1f5f9;
      width: 100%;
    }

    .progress-segment {
      height: 100%;
    }

    .progress-segment.green {
      background: rgba(34, 160, 107, 0.5); /* #22A06B with 50% opacity */
    }

    .progress-segment.orange {
      background: rgba(232, 119, 34, 0.5); /* #E87722 with 50% opacity */
    }

    .progress-segment.red {
      background: rgba(185, 28, 28, 0.5); /* #B91C1C with 50% opacity */
    }

    .health-labels-row {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 13px;
      color: #64748b;
      white-space: nowrap;
    }

    .health-label-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .health-label-item strong {
      color: #0f172a;
      font-weight: 700;
    }

    .stat-body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: #707788;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #252a34;
    }

    /* Toolbar */
    .register-toolbar {
      background: #ffffff;
      padding: 10px 16px;
      margin-bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
    }

    .items-count {
      font-size: 13.5px;
      font-weight: 500;
      color: #64748b;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .text-primary { color: var(--brand, #007aff) !important; }
    .text-warning { color: #b27b00 !important; }
    .text-emerald { color: #16a15f !important; }
    .text-success { color: #16a15f !important; }
    .text-danger { color: #de350b !important; }

    .tb-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 8px;
      padding: 8px 14px;
      color: #252a34;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }

    .tb-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .primary-tb {
      background: var(--brand, #007aff);
      border-color: var(--brand, #007aff);
      color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 122, 255, 0.15);
    }

    .primary-tb:hover {
      background: #0062cc;
      border-color: #0062cc;
    }

    .date-cell, .period-text {
      color: #555555;
    }

    .scope-tag {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(0, 122, 255, 0.08);
      color: #007aff;
      border: 1px solid rgba(0, 122, 255, 0.25);
    }

    .avatar-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .avatar-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 9.5px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
    }

    .owner-name {
      font-size: 13px;
      color: #252a34;
    }

    /* Status Pill Tones */
    ::ng-deep .dependency-register-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    ::ng-deep .dependency-register-pill.emerald {
      background: #e8f7ee;
      color: #16a15f;
      border: 1px solid rgba(22, 161, 95, 0.2);
    }

    ::ng-deep .dependency-register-pill.amber {
      background: #fff8e6;
      color: #b27b00;
      border: 1px solid rgba(178, 123, 0, 0.2);
    }

    ::ng-deep .dependency-register-pill.red {
      background: #fdf2f2;
      color: #de350b;
      border: 1px solid rgba(222, 53, 11, 0.2);
    }

    ::ng-deep .dependency-register-pill.neutral {
      background: #f4f5f7;
      color: #5e6c84;
      border: 1px solid rgba(94, 108, 132, 0.2);
    }

    /* Animations */
    .animation-slide {
      animation: slideIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(8px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .filter-dropdown-container {
      position: relative;
    }

    .filter-menu-popover {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 6px;
      background: #ffffff;
      border: 1px solid #edf0f6;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(25, 33, 61, 0.12);
      width: 160px;
      z-index: 100;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .filter-option {
      background: transparent;
      border: none;
      border-radius: 6px;
      padding: 8px 12px;
      text-align: left;
      font-size: 13px;
      font-weight: 500;
      color: #5e6c84;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
      width: 100%;
    }

    .filter-option:hover {
      background: #f4f5f7;
      color: #252a34;
    }

    .filter-option.is-active {
      background: rgba(0, 122, 255, 0.08);
      color: var(--brand, #007aff);
      font-weight: 600;
    }

    /* Actions context menu styles */
    .action-menu-trigger {
      background: transparent;
      border: none;
      color: #707788;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    .action-menu-trigger:hover {
      background: #f4f5f7;
      color: #252a34;
    }

    .row-menu-popover {
      position: absolute;
      right: 64px;
      top: 80%;
      background: #ffffff;
      border: 1px solid #edf0f6;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(25, 33, 61, 0.12);
      width: 140px;
      z-index: 101;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: left;
    }

    .menu-item {
      background: transparent;
      border: none;
      border-radius: 6px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #5e6c84;
      cursor: pointer;
      width: 100%;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    .menu-item:hover {
      background: #f4f5f7;
      color: #252a34;
    }

    .menu-item-icon {
      font-size: 14px;
    }

    .menu-item.text-danger {
      color: #de350b;
    }

    .menu-item.text-danger:hover {
      background: rgba(222, 53, 11, 0.08);
      color: #de350b;
    }

    /* Equal gaps, full width, and Register tab aligned typography */
    .pm-project-table {
      width: 100% !important;
      min-width: 100% !important;
      table-layout: fixed;
    }

    .pm-project-table th {
      background: #f8fafc;
      color: #555555;
      font-size: 12.5px;
      font-weight: 600;
      padding: 13px 14px;
      border-bottom: 1px solid #eceef3;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .pm-project-table td {
      border-bottom: 1px solid #eceef3;
      padding: 13px 14px;
      vertical-align: middle;
    }

    .pm-project-table th:last-child,
    .pm-project-table td:last-child {
      padding-right: 64px !important; /* Prevent overlap with chatbot bubble icon */
    }

    .report-name-title {
      font-size: 13.5px;
      font-weight: 600;
      color: #252a34;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .period-text, .date-cell {
      font-size: 13px;
      color: #555555;
    }

    .owner-name {
      font-size: 13px;
      color: #252a34;
    }
  `]
})
export class PortfolioWorkspaceReportsComponent {
  activeTab: ReportsTab = 'past';

  awaitingReview = portfolioReports.awaitingReview;
  scheduled = portfolioReports.scheduled;
  past = portfolioReports.past;
  reportsStats = reportsStats;

  showFilterDropdown = false;
  selectedStatusFilter: 'all' | 'Submitted' | 'Draft' = 'all';
  activeMenuRowName: string | null = null;

  get filteredPastReports() {
    if (this.selectedStatusFilter === 'all') {
      return this.past;
    }
    return this.past.filter(r => r.status === this.selectedStatusFilter);
  }

  get submittedCount(): number {
    return this.past.filter(r => r.status === 'Submitted').length;
  }

  toggleFilterDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showFilterDropdown = !this.showFilterDropdown;
    this.activeMenuRowName = null;
  }

  setFilterStatus(status: 'all' | 'Submitted' | 'Draft'): void {
    this.selectedStatusFilter = status;
    this.showFilterDropdown = false;
  }

  toggleRowMenu(rowName: string, event: MouseEvent): void {
    event.stopPropagation();
    this.showFilterDropdown = false;
    this.activeMenuRowName = this.activeMenuRowName === rowName ? null : rowName;
  }

  onMenuOption(rowName: string, option: string): void {
    console.log(`Menu action '${option}' selected for report: ${rowName}`);
    this.activeMenuRowName = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showFilterDropdown = false;
    this.activeMenuRowName = null;
  }

  setTab(tab: ReportsTab): void {
    this.activeTab = tab;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }

  getCreatorAvatarStyles(name: string): { [key: string]: string } {
    if (name && name.includes('Khalid')) {
      return { background: '#DFDFEE', color: '#4F46E5' };
    }
    return { background: '#E6ECF8', color: '#244980' };
  }

  statusTone(status: string): string {
    switch (status.toLowerCase()) {
      case 'submitted':
      case 'on-track':
      case 'active':
        return 'emerald';
      case 'draft':
      case 'under review':
      case 'pending approval':
        return 'amber';
      case 'not created':
      case 'alert':
      case 'delayed':
      case 'off-track':
        return 'red';
      default:
        return 'neutral';
    }
  }
}
