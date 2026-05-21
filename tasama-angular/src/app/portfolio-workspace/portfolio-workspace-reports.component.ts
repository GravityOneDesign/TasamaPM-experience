import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import { portfolioReports, AwaitingReviewRow, ScheduledReportRow, PastReportRow } from './portfolio-workspace.data';

type ReportsTab = 'awaiting' | 'scheduled' | 'past';

@Component({
  selector: 'app-portfolio-workspace-reports',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-reports-tab">
      
      <!-- Sub-tabs header -->
      <div class="reports-header-row">
        <div class="pm-register-tabs sub-tabs">
          <button
            class="pm-register-tab"
            [class.is-active]="activeTab === 'awaiting'"
            type="button"
            (click)="setTab('awaiting')"
          >
            <span>Awaiting Review</span>
          </button>
          <button
            class="pm-register-tab"
            [class.is-active]="activeTab === 'scheduled'"
            type="button"
            (click)="setTab('scheduled')"
          >
            <span>Scheduled Reports</span>
          </button>
          <button
            class="pm-register-tab"
            [class.is-active]="activeTab === 'past'"
            type="button"
            (click)="setTab('past')"
          >
            <span>Past Portfolio Reports</span>
          </button>
        </div>

        @if (activeTab === 'past') {
          <button class="create-report-btn" type="button">
            <span [pmConsoleIcon]="'plus'"></span>
            <span>Create Report</span>
          </button>
        }
      </div>

      <!-- Content Outlets -->
      @switch (activeTab) {
        
        <!-- AWAITING REVIEW -->
        @case ('awaiting') {
          <div class="reports-outlet-content animation-slide">
            <!-- Premium Stats Bar -->
            <div class="dashboard-stats-grid">
              
              <article class="dashboard-stat-card total-reports-card">
                <div class="donut-indicator-wrapper">
                  <div class="donut-ring">
                    <span class="donut-value">10/16</span>
                  </div>
                </div>
                <div class="stat-copy">
                  <span class="stat-label">Total Reports</span>
                  <strong class="stat-highlight">Submitted 10 · Due 6</strong>
                </div>
              </article>

              <article class="dashboard-stat-card compliance-card">
                <div class="compliance-circle">
                  <span class="comp-val">75%</span>
                </div>
                <div class="stat-copy">
                  <span class="stat-label">Reporting Compliance</span>
                  <strong class="stat-highlight text-emerald">+26% Increase ↑</strong>
                </div>
              </article>

              <article class="dashboard-stat-card project-health-distribution">
                <div class="stat-copy w-full">
                  <span class="stat-label">Project Health Distribution</span>
                  <div class="health-segmented-bar">
                    <div class="segment off-track" style="width: 60%" title="Off track: 60%"></div>
                    <div class="segment delayed" style="width: 25%" title="Delayed: 25%"></div>
                    <div class="segment on-track" style="width: 15%" title="On track: 15%"></div>
                  </div>
                  <div class="bar-legend">
                    <span><span class="dot bg-red"></span>Off Track (60%)</span>
                    <span><span class="dot bg-amber"></span>Delayed (25%)</span>
                    <span><span class="dot bg-emerald"></span>On Track (15%)</span>
                  </div>
                </div>
              </article>

            </div>

            <!-- Toolbar & Items Count -->
            <div class="reports-toolbar">
              <span class="items-count">{{ awaitingReview.length }} reports awaiting review</span>
              <div class="toolbar-actions">
                <label class="search-box">
                  <span pmConsoleIcon="search"></span>
                  <input type="search" placeholder="Search intervals..." />
                </label>
                <button class="tb-btn" type="button"><span [pmConsoleIcon]="'filter'"></span><span>Filter</span></button>
              </div>
            </div>

            <!-- Table -->
            <div class="pm-project-table-view">
              <table class="reports-table">
                <thead>
                  <tr>
                    <th>Reporting Interval</th>
                    <th>Due By</th>
                    <th>Reporting Status</th>
                    <th>Project Status</th>
                    <th style="text-align: right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of awaitingReview; track row.interval) {
                    <tr>
                      <td><strong>{{ row.interval }}</strong></td>
                      <td class="date-cell">{{ formatDate(row.dueBy) }}</td>
                      <td>
                        <span [pmConsoleStatusPill]="row.reportingStatus" baseClass="dependency-register-pill" [tone]="statusTone(row.reportingStatus)"></span>
                      </td>
                      <td>
                        <span [pmConsoleStatusPill]="row.projectStatus" baseClass="dependency-register-pill" [tone]="statusTone(row.projectStatus)"></span>
                      </td>
                      <td style="text-align: right">
                        @if (row.reportingStatus === 'Draft') {
                          <button class="report-action-btn report-row-create" type="button">Resume</button>
                        } @else if (row.reportingStatus === 'Not Created') {
                          <button class="report-action-btn report-row-create" type="button">Create</button>
                        } @else {
                          <button class="report-action-btn report-row-preview" type="button">
                            <span [pmConsoleIcon]="'eye'" class="preview-eye"></span>
                            <span>Preview</span>
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- SCHEDULED REPORTS -->
        @case ('scheduled') {
          <div class="reports-outlet-content animation-slide">
            <!-- Stats Row -->
            <div class="dashboard-stats-grid">
              <article class="dashboard-stat-card flex-row-card">
                <span [pmConsoleIcon]="'clock'" class="s-card-icon text-primary"></span>
                <div class="stat-copy">
                  <span class="stat-label">Total Scheduled</span>
                  <strong class="stat-value">{{ scheduled.length }} Reports</strong>
                </div>
              </article>

              <article class="dashboard-stat-card flex-row-card">
                <span [pmConsoleIcon]="'calendar'" class="s-card-icon text-warning"></span>
                <div class="stat-copy">
                  <span class="stat-label">Next Portfolio Due</span>
                  <strong class="stat-value">May 26, 2026</strong>
                </div>
              </article>

              <article class="dashboard-stat-card flex-row-card">
                <span [pmConsoleIcon]="'layers'" class="s-card-icon text-emerald"></span>
                <div class="stat-copy">
                  <span class="stat-label">Frequency Breakdown</span>
                  <strong class="stat-highlight">1 Weekly · 2 Monthly · 1 Quarterly</strong>
                </div>
              </article>
            </div>

            <!-- Toolbar -->
            <div class="reports-toolbar">
              <span class="items-count">{{ scheduled.length }} active report schedules</span>
            </div>

            <!-- Table -->
            <div class="pm-project-table-view">
              <table class="reports-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Scope</th>
                    <th>Frequency</th>
                    <th>Next Due</th>
                    <th>Assignee</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of scheduled; track row.name) {
                    <tr>
                      <td><strong>{{ row.name }}</strong></td>
                      <td><span class="scope-tag">{{ row.scope }}</span></td>
                      <td>{{ row.frequency }}</td>
                      <td class="date-cell">{{ formatDate(row.nextDue) }}</td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle">{{ getInitials(row.assignee) }}</div>
                          <span>{{ row.assignee }}</span>
                        </div>
                      </td>
                      <td>
                        <span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="row.status === 'Active' ? 'emerald' : 'neutral'"></span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- PAST PORTFOLIO REPORTS -->
        @case ('past') {
          <div class="reports-outlet-content animation-slide">
            <!-- Stats row -->
            <div class="dashboard-stats-grid">
              <article class="dashboard-stat-card flex-row-card">
                <span [pmConsoleIcon]="'folder-check'" class="s-card-icon text-success"></span>
                <div class="stat-copy">
                  <span class="stat-label">Total Past Reports</span>
                  <strong class="stat-value">{{ past.length }} Submitted</strong>
                </div>
              </article>

              <article class="dashboard-stat-card flex-row-card">
                <span [pmConsoleIcon]="'calendar'" class="s-card-icon text-primary"></span>
                <div class="stat-copy">
                  <span class="stat-label">Last Submitted Report</span>
                  <strong class="stat-value">May 02, 2026</strong>
                </div>
              </article>

              <article class="dashboard-stat-card flex-row-card">
                <span [pmConsoleIcon]="'award'" class="s-card-icon text-warning"></span>
                <div class="stat-copy">
                  <span class="stat-label">Average Submission Score</span>
                  <strong class="stat-value">94.8%</strong>
                </div>
              </article>
            </div>

            <!-- Toolbar -->
            <div class="reports-toolbar">
              <span class="items-count">{{ past.length }} archival summaries found</span>
            </div>

            <!-- Table -->
            <div class="pm-project-table-view">
              <table class="reports-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Reporting Period</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Created At</th>
                    <th style="text-align: right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of past; track row.name) {
                    <tr>
                      <td><strong>{{ row.name }}</strong></td>
                      <td class="period-text">{{ row.period }}</td>
                      <td>
                        <span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="row.status === 'Submitted' ? 'emerald' : 'amber'"></span>
                      </td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle">{{ getInitials(row.createdBy) }}</div>
                          <span>{{ row.createdBy }}</span>
                        </div>
                      </td>
                      <td class="date-cell">{{ formatDate(row.createdAt) }}</td>
                      <td style="text-align: right">
                        <button class="report-action-btn report-row-preview" type="button">
                          <span [pmConsoleIcon]="'eye'" class="preview-eye"></span>
                          <span>Preview</span>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      }

    </div>
  `,
  styles: [`
    .workspace-reports-tab {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 24px;
      animation: fadeIn 0.3s ease-out;
    }

    .reports-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    }

    /* Sub-tabs styling */
    .sub-tabs.pm-register-tabs {
      border-bottom: none;
      padding-bottom: 0px;
      display: flex;
      gap: 24px;
    }

    .sub-tabs .pm-register-tab {
      background: transparent;
      border: none;
      padding: 12px 4px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-muted, #8e8e93);
      cursor: pointer;
      position: relative;
      transition: color 0.2s ease;
    }

    .sub-tabs .pm-register-tab::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: transparent;
      transition: background-color 0.2s ease;
    }

    .sub-tabs .pm-register-tab.is-active {
      color: var(--color-primary, #007aff);
      font-weight: 600;
    }

    .sub-tabs .pm-register-tab.is-active::after {
      background: var(--color-primary, #007aff);
    }

    .create-report-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--color-primary, #007aff);
      border: 1px solid var(--color-primary, #007aff);
      border-radius: 6px;
      padding: 8px 14px;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
      transition: background-color 0.15s ease;
    }

    .create-report-btn:hover {
      background: #0062cc;
    }

    .reports-outlet-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Premium Stats Dashboard */
    .dashboard-stats-grid {
      display: grid;
      grid-template-columns: 280px 280px 1fr;
      gap: 16px;
    }

    .dashboard-stat-card {
      background: var(--bg-card, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 20px;
      backdrop-filter: blur(10px);
    }

    .flex-row-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }

    .s-card-icon {
      font-size: 24px;
    }

    .text-primary { color: #007aff; }
    .text-warning { color: #ff9f0a; }
    .text-emerald { color: #30d158; }
    .text-success { color: #30d158; }

    .donut-indicator-wrapper {
      position: relative;
      width: 52px;
      height: 52px;
    }

    .donut-ring {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.2);
      border: 3.5px solid rgba(0, 122, 255, 0.15);
      border-top-color: #007aff;
      border-right-color: #007aff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .donut-value {
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
    }

    .compliance-circle {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(52, 199, 89, 0.1);
      border: 3.5px solid rgba(52, 199, 89, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #30d158;
    }

    .comp-val {
      font-size: 13px;
      font-weight: 700;
    }

    .stat-copy {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .w-full {
      width: 100%;
    }

    .stat-label {
      font-size: 10.5px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .stat-highlight {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
    }

    /* Horizontal Segmented Bar */
    .health-segmented-bar {
      display: flex;
      height: 10px;
      border-radius: 5px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.05);
      margin: 8px 0 10px 0;
    }

    .segment {
      height: 100%;
    }

    .segment.off-track { background: #ff453a; }
    .segment.delayed { background: #ff9f0a; }
    .segment.on-track { background: #30d158; }

    .bar-legend {
      display: flex;
      gap: 16px;
    }

    .bar-legend span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--color-text-muted, #8e8e93);
      font-weight: 500;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      display: inline-block;
    }

    .bg-red { background: #ff453a; }
    .bg-amber { background: #ff9f0a; }
    .bg-emerald { background: #30d158; }

    /* Reports Toolbar */
    .reports-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-card, rgba(255, 255, 255, 0.02));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
      border-radius: 8px;
      padding: 10px 16px;
    }

    .items-count {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-input, rgba(0, 0, 0, 0.25));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 6px;
      padding: 5px 10px;
      width: 200px;
    }

    .search-box span {
      color: var(--color-text-muted, #8e8e93);
      font-size: 12px;
    }

    .search-box input {
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 12px;
      width: 100%;
    }

    .tb-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 6px;
      padding: 6px 12px;
      color: #ffffff;
      font-size: 12px;
      cursor: pointer;
    }

    /* Table styling */
    .pm-project-table-view {
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      overflow: hidden;
      background: var(--bg-card, rgba(255, 255, 255, 0.04));
    }

    .reports-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .reports-table th {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      background: rgba(0, 0, 0, 0.15);
    }

    .reports-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
      font-size: 13px;
      color: var(--color-text, #ffffff);
      vertical-align: middle;
    }

    .reports-table tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .date-cell, .period-text {
      color: var(--color-text-semi, #e5e5ea);
    }

    .scope-tag {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(0, 122, 255, 0.15);
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
      background: var(--color-primary-soft, rgba(0, 122, 255, 0.15));
      color: var(--color-primary, #007aff);
      font-size: 9px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0, 122, 255, 0.2);
    }

    /* Action Buttons */
    .report-action-btn {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .report-row-create {
      background: var(--color-primary, #007aff);
      color: #ffffff;
      border: 1px solid var(--color-primary, #007aff);
    }

    .report-row-create:hover {
      background: #0062cc;
    }

    .report-row-preview {
      background: rgba(255, 255, 255, 0.06);
      color: var(--color-text, #ffffff);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .report-row-preview:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .preview-eye {
      font-size: 12px;
      color: var(--color-primary, #007aff);
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
  `]
})
export class PortfolioWorkspaceReportsComponent {
  activeTab: ReportsTab = 'awaiting';

  awaitingReview = portfolioReports.awaitingReview;
  scheduled = portfolioReports.scheduled;
  past = portfolioReports.past;

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
