import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import { planContent } from './portfolio-workspace.data';

@Component({
  selector: 'app-portfolio-workspace-plan',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-plan-tab">
      
      <!-- 1. Problem Statement -->
      <section class="plan-section">
        <div class="section-sidebar">
          <span [pmConsoleIcon]="'help-circle'" class="sidebar-icon"></span>
          <h5>Opportunity or Problem Statement</h5>
        </div>
        <div class="section-card">
          <div class="text-block-wrapper">
            <label class="block-label">Problem Statement</label>
            <div class="read-only-text">
              {{ problemStatement }}
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Schedule & Scope -->
      <section class="plan-section">
        <div class="section-sidebar">
          <span [pmConsoleIcon]="'calendar'" class="sidebar-icon"></span>
          <h5>Schedule & scope</h5>
        </div>
        <div class="section-card">
          <div class="dates-grid">
            <div class="date-field-group">
              <label class="field-label">Baseline Start Date</label>
              <div class="date-input-display">
                <span [pmConsoleIcon]="'calendar'" class="input-icon"></span>
                <span>{{ formatDate(schedule.baselineStart) }}</span>
              </div>
            </div>
            <div class="date-field-group">
              <label class="field-label">Baseline End Date</label>
              <div class="date-input-display">
                <span [pmConsoleIcon]="'calendar'" class="input-icon"></span>
                <span>{{ formatDate(schedule.baselineEnd) }}</span>
              </div>
            </div>
          </div>

          <div class="milestones-wrapper">
            <h6 class="card-subtitle">Milestones Progress</h6>
            <div class="pm-project-table-scroll">
              <table class="pm-project-table">
                <thead>
                  <tr>
                    <th style="width: 50%">Milestone</th>
                    <th style="width: 30%">Date</th>
                    <th style="width: 20%">Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (m of schedule.milestones; track m.milestone) {
                    <tr>
                      <td class="milestone-name"><strong>{{ m.milestone }}</strong></td>
                      <td class="milestone-date">{{ formatDate(m.date) }}</td>
                      <td>
                        <span [pmConsoleStatusPill]="m.status" baseClass="dependency-register-pill" [tone]="statusTone(m.status)"></span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Budget -->
      <section class="plan-section">
        <div class="section-sidebar">
          <span [pmConsoleIcon]="'wallet'" class="sidebar-icon"></span>
          <h5>Budget</h5>
        </div>
        <div class="section-card">
          <div class="budget-stats-grid">
            <article class="pm-project-table-stat blue">
              <span><span [pmConsoleIcon]="'dollar-sign'"></span></span>
              <div class="stat-body">
                <small class="stat-label">Total Budget</small>
                <div class="stat-value-row">
                  <strong class="stat-value text-primary">{{ budget.total }}</strong>
                </div>
              </div>
            </article>

            <article class="pm-project-table-stat green">
              <span><span [pmConsoleIcon]="'trending-up'"></span></span>
              <div class="stat-body">
                <small class="stat-label">Spent to Date</small>
                <div class="stat-value-row">
                  <strong class="stat-value text-success">{{ budget.spent }}</strong>
                </div>
              </div>
            </article>

            <article class="pm-project-table-stat neutral resource-card">
              <span><span [pmConsoleIcon]="'users'"></span></span>
              <div class="stat-body">
                <small class="stat-label">Non-Financial Resources</small>
                <p class="stat-desc">{{ budget.nonFinancialResources }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- 4. Mandatory Watchlist -->
      <section class="plan-section">
        <div class="section-sidebar">
          <span [pmConsoleIcon]="'shield-alert'" class="sidebar-icon"></span>
          <h5>Mandatory watchlist</h5>
        </div>
        <div class="section-card watchlist-card">
          <div class="card-header-row">
            <h6 class="card-subtitle no-margin">Tracked Items</h6>
            <span class="count-badge">{{ watchlist.length }} Items</span>
          </div>

          <div class="pm-project-table-scroll">
            <table class="pm-project-table">
              <thead>
                <tr>
                  <th style="width: 40%">Watchlist Item</th>
                  <th style="width: 25%">Owner</th>
                  <th style="width: 18%">Status</th>
                  <th style="width: 17%">Due Date</th>
                </tr>
              </thead>
              <tbody>
                @for (item of watchlist; track item.id) {
                  <tr>
                    <td class="watchlist-item-name">
                      <strong>{{ item.item }}</strong>
                    </td>
                    <td>
                      <div class="avatar-cell">
                        <div class="avatar-circle">{{ getInitials(item.owner) }}</div>
                        <span class="owner-name">{{ item.owner }}</span>
                      </div>
                    </td>
                    <td>
                      <span [pmConsoleStatusPill]="item.status" baseClass="dependency-register-pill" [tone]="statusTone(item.status)"></span>
                    </td>
                    <td class="watchlist-date">{{ formatDate(item.dueDate) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .workspace-plan-tab {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 10px 0;
      animation: fadeIn 0.3s ease-out;
    }

    .plan-section {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 24px;
      align-items: start;
    }

    .section-sidebar {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 8px;
    }

    .sidebar-icon {
      font-size: 18px;
      color: var(--brand, #007aff);
    }

    .section-sidebar h5 {
      font-size: 14px;
      font-weight: 600;
      color: #202633;
      margin: 0;
      line-height: 1.4;
    }

    .section-card {
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
    }

    .text-block-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .block-label, .field-label {
      font-size: 11px;
      font-weight: 600;
      color: #707788;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .read-only-text {
      background: #f8fafc;
      border: 1px solid #edf0f6;
      border-radius: 8px;
      padding: 16px;
      font-size: 14px;
      line-height: 1.6;
      color: #252a34;
      min-height: 80px;
    }

    .dates-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .date-field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .date-input-display {
      background: #f8fafc;
      border: 1px solid #edf0f6;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      color: #252a34;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .input-icon {
      color: var(--brand, #007aff);
      font-size: 16px;
    }

    .card-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: #707788;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 12px 0;
    }

    .card-subtitle.no-margin {
      margin: 0;
    }

    .milestones-wrapper {
      margin-top: 16px;
      border-top: 1px solid #edf0f6;
      padding-top: 20px;
    }

    .milestone-name strong, .watchlist-item-name strong {
      font-weight: 600;
      color: #252a34;
    }

    .milestone-date, .watchlist-date {
      color: #555555;
    }

    .budget-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin: 4px 0;
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
      letter-spacing: 0.03em;
    }

    .stat-value-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      width: 100%;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #252a34;
    }

    .stat-value.text-primary {
      color: var(--brand, #007aff) !important;
    }

    .stat-value.text-success {
      color: #16a15f !important;
    }

    .stat-desc {
      font-size: 13px;
      color: #252a34;
      margin: 4px 0 0 0;
      line-height: 1.4;
    }

    .watchlist-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #edf0f6;
      padding-bottom: 12px;
    }

    .count-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 20px;
      background: rgba(0, 122, 255, 0.08);
      color: var(--brand, #007aff);
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
      background: rgba(0, 122, 255, 0.08);
      color: #007aff;
      border: 1.5px solid rgba(0, 122, 255, 0.2);
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

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PortfolioWorkspacePlanComponent {
  problemStatement = planContent.problemStatement;
  schedule = planContent.schedule;
  budget = planContent.budget;
  watchlist = planContent.mandatoryWatchlist;

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
      case 'on-track':
      case 'completed':
        return 'emerald';
      case 'under review':
      case 'draft':
        return 'amber';
      case 'alert':
      case 'delayed':
      case 'off-track':
        return 'red';
      default:
        return 'neutral';
    }
  }
}

