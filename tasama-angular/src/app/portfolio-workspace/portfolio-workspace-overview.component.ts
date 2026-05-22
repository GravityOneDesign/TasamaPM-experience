import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import { portfolioSummary, KPICard, ObjectiveRow } from './portfolio-workspace.data';

@Component({
  selector: 'app-portfolio-workspace-overview',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-overview-tab">
      <!-- 1. Top Section Grid (Description & Key Roles) -->
      <div class="overview-top-grid">
        <div class="overview-header-card description-card">
          <h3>Description</h3>
          <p class="description-text">{{ description }}</p>
        </div>

        <div class="overview-header-card roles-card">
          <h3>Portfolio Roles</h3>
          <div class="roles-list">
            <div class="role-item">
              <span class="role-label">Portfolio Owner</span>
              <div class="role-content">
                <div class="avatar-circle font-owner">{{ getInitials(owner) }}</div>
                <strong class="role-name">{{ owner }}</strong>
              </div>
            </div>
            <div class="role-divider"></div>
            <div class="role-item">
              <span class="role-label">Portfolio Sponsor</span>
              <div class="role-content">
                <div class="avatar-circle font-sponsor">{{ getInitials(sponsor) }}</div>
                <strong class="role-name">{{ sponsor }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. KPI Summary Stat Cards Grid -->
      <div class="pm-project-table-stats">
        @for (kpi of kpis; track kpi.label) {
          <article class="pm-project-table-stat {{ kpiTone(kpi.label) }}">
            <span><span [pmConsoleIcon]="kpi.icon"></span></span>
            <div class="stat-body">
              <small>{{ kpi.label }}</small>
              <div class="stat-value-row">
                <strong class="stat-value">{{ kpi.value }}</strong>
                <span class="stat-trend" [class.trend-up]="kpi.trend.startsWith('+')" [class.trend-stable]="kpi.trend === 'Stable'">
                  {{ kpi.trend }}
                </span>
              </div>
            </div>
          </article>
        }
      </div>

      <!-- 3. Strategic Objectives Table Section -->
      <div class="objectives-container">
        <div class="section-header">
          <span [pmConsoleIcon]="'target'" class="section-icon"></span>
          <h4>Strategic Objectives & Performance Measures</h4>
        </div>
        
        <!-- Standard Dense Table Layout -->
        <div class="pm-project-table-scroll">
          <table class="pm-project-table">
            <thead>
              <tr>
                <th style="width: 35%">Objective</th>
                <th style="width: 35%">Target Measure</th>
                <th style="width: 18%">Owner</th>
                <th style="width: 12%">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (obj of objectives; track obj.title) {
                <tr>
                  <td class="objective-title">
                    <strong>{{ obj.title }}</strong>
                  </td>
                  <td class="objective-measure">{{ obj.measure }}</td>
                  <td>
                    <div class="avatar-cell">
                      <div class="avatar-circle font-owner">{{ getInitials(obj.owner) }}</div>
                      <span class="owner-name">{{ obj.owner }}</span>
                    </div>
                  </td>
                  <td>
                    <span [pmConsoleStatusPill]="obj.status" baseClass="dependency-register-pill" [tone]="statusTone(obj.status)"></span>
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
    .workspace-overview-tab {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 10px 0;
      animation: fadeIn 0.3s ease-out;
    }

    .overview-top-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 16px;
      align-items: stretch;
    }

    .overview-header-card {
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      display: flex;
      flex-direction: column;
    }

    .overview-header-card h3 {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #707788;
      margin: 0 0 10px 0;
    }

    .description-text {
      font-size: 15px;
      line-height: 1.6;
      color: #252a34;
      margin: 0;
    }

    .roles-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 4px;
      justify-content: center;
      flex-grow: 1;
    }

    .role-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .role-label {
      font-size: 9.5px;
      font-weight: 600;
      color: #707788;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .role-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .role-name {
      font-size: 13.5px;
      font-weight: 600;
      color: #202633;
    }

    .role-divider {
      height: 1px;
      background: #e3e5e9;
    }

    .pm-project-table-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 4px 0;
    }

    .stat-body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    .stat-value-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      width: 100%;
    }

    .stat-trend {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(15, 23, 42, 0.04);
      color: #555555;
    }

    .stat-trend.trend-up {
      color: #16a15f;
      background: #e8f7ee;
    }

    .stat-trend.trend-stable {
      color: var(--brand, #007aff);
      background: rgba(0, 122, 255, 0.08);
    }

    .objectives-container {
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .section-icon {
      color: var(--brand, #007aff);
      font-size: 18px;
    }

    .section-header h4 {
      font-size: 15px;
      font-weight: 600;
      color: #202633;
      margin: 0;
    }

    .objective-title strong {
      font-weight: 600;
      color: #252a34;
    }

    .objective-measure {
      color: #555555;
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
    }

    .font-owner {
      background: rgba(0, 122, 255, 0.08);
      color: #007aff;
      border: 1.5px solid rgba(0, 122, 255, 0.2);
    }

    .font-sponsor {
      background: rgba(255, 159, 10, 0.08);
      color: #ff9f0a;
      border: 1.5px solid rgba(255, 159, 10, 0.2);
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
export class PortfolioWorkspaceOverviewComponent implements OnInit {
  description = portfolioSummary.description;
  kpis = portfolioSummary.kpis;
  objectives = portfolioSummary.objectives;
  owner = portfolioSummary.owner;
  sponsor = portfolioSummary.sponsor;

  ngOnInit(): void {}

  kpiTone(label: string): string {
    switch (label.toLowerCase()) {
      case 'overall progress': return 'blue';
      case 'active programs': return 'blue';
      case 'budget utilisation': return 'blue';
      case 'compliance rate': return 'green';
      default: return 'neutral';
    }
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
