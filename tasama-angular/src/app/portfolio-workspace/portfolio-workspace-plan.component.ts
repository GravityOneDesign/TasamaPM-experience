import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import { planContent, MilestoneRow, MandatoryWatchlistRow } from './portfolio-workspace.data';

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
            <div class="pm-project-table-view">
              <table class="milestones-table">
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Date</th>
                    <th>Status</th>
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
            <article class="pm-project-table-stat budget-stat-card">
              <span [pmConsoleIcon]="'dollar-sign'" class="b-icon"></span>
              <div class="stat-meta">
                <span class="stat-label">Total Budget</span>
                <strong class="stat-value text-primary">{{ budget.total }}</strong>
              </div>
            </article>

            <article class="pm-project-table-stat budget-stat-card">
              <span [pmConsoleIcon]="'trending-up'" class="b-icon"></span>
              <div class="stat-meta">
                <span class="stat-label">Spent to Date</span>
                <strong class="stat-value text-success">{{ budget.spent }}</strong>
              </div>
            </article>

            <article class="pm-project-table-stat budget-stat-card resource-card">
              <span [pmConsoleIcon]="'users'" class="b-icon"></span>
              <div class="stat-meta">
                <span class="stat-label">Non-Financial Resources</span>
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

          <div class="pm-project-table-view">
            <table class="watchlist-table">
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
      gap: 32px;
      padding: 24px;
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
      font-size: 24px;
      color: var(--color-primary, #007aff);
    }

    .section-sidebar h5 {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text, #ffffff);
      margin: 0;
      line-height: 1.4;
    }

    .section-card {
      background: var(--bg-card, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
    }

    .text-block-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .block-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .read-only-text {
      background: var(--bg-input, rgba(0, 0, 0, 0.2));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
      border-radius: 8px;
      padding: 16px;
      font-size: 14px;
      line-height: 1.6;
      color: var(--color-text-semi, #e5e5ea);
      min-height: 80px;
    }

    .dates-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .date-field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .date-input-display {
      background: var(--bg-input, rgba(0, 0, 0, 0.2));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      color: var(--color-text, #ffffff);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .input-icon {
      color: var(--color-primary, #007aff);
      font-size: 16px;
    }

    .card-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 12px 0;
    }

    .card-subtitle.no-margin {
      margin: 0;
    }

    .milestones-wrapper {
      margin-top: 16px;
      border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
      padding-top: 20px;
    }

    .milestones-table, .watchlist-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .milestones-table th, .watchlist-table th {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    }

    .milestones-table td, .watchlist-table td {
      padding: 12px;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.04));
      font-size: 13px;
      color: var(--color-text, #ffffff);
      vertical-align: middle;
    }

    .milestone-name strong, .watchlist-item-name strong {
      font-weight: 500;
      color: var(--color-text, #ffffff);
    }

    .milestone-date, .watchlist-date {
      color: var(--color-text-muted, #8e8e93);
    }

    .budget-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .budget-stat-card {
      background: var(--bg-input, rgba(0, 0, 0, 0.15));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
      border-radius: 10px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .b-icon {
      font-size: 20px;
      color: var(--color-primary, #007aff);
    }

    .stat-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
    }

    .stat-value.text-primary {
      color: #007aff;
    }

    .stat-value.text-success {
      color: #30d158;
    }

    .resource-card {
      grid-column: span 1;
    }

    .stat-desc {
      font-size: 12px;
      color: var(--color-text-semi, #e5e5ea);
      margin: 2px 0 0 0;
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
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
      padding-bottom: 12px;
    }

    .count-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 20px;
      background: var(--color-primary-soft, rgba(0, 122, 255, 0.15));
      color: var(--color-primary, #007aff);
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

    .owner-name {
      font-size: 12px;
      color: var(--color-text-semi, #e5e5ea);
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
      background: rgba(52, 199, 89, 0.12);
      color: #30d158;
      border: 1px solid rgba(52, 199, 89, 0.2);
    }

    ::ng-deep .dependency-register-pill.amber {
      background: rgba(255, 159, 10, 0.12);
      color: #ff9f0a;
      border: 1px solid rgba(255, 159, 10, 0.2);
    }

    ::ng-deep .dependency-register-pill.red {
      background: rgba(255, 69, 58, 0.12);
      color: #ff453a;
      border: 1px solid rgba(255, 69, 58, 0.2);
    }

    ::ng-deep .dependency-register-pill.neutral {
      background: rgba(142, 142, 147, 0.12);
      color: #aeaeb2;
      border: 1px solid rgba(142, 142, 147, 0.2);
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
