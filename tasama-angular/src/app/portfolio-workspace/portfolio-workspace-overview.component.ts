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
      <div class="overview-header-card">
        <h3>Description</h3>
        <p class="description-text">{{ description }}</p>
      </div>

      <div class="kpis-grid">
        @for (kpi of kpis; track kpi.label) {
          <article class="pm-project-table-stat kpi-card">
            <div class="stat-icon-wrapper">
              <span [pmConsoleIcon]="kpi.icon" class="kpi-icon"></span>
            </div>
            <div class="stat-meta">
              <span class="stat-label">{{ kpi.label }}</span>
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

      <div class="objectives-container">
        <div class="section-header">
          <span [pmConsoleIcon]="'target'" class="section-icon"></span>
          <h4>Strategic Objectives & Performance Measures</h4>
        </div>
        
        <div class="table-wrapper pm-project-table-view">
          <table class="objectives-table">
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
                      <div class="avatar-circle">{{ getInitials(obj.owner) }}</div>
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
      padding: 24px;
      animation: fadeIn 0.3s ease-out;
    }

    .overview-header-card {
      background: var(--bg-card, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(10px);
    }

    .overview-header-card h3 {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted, #8e8e93);
      margin: 0 0 10px 0;
    }

    .description-text {
      font-size: 15px;
      line-height: 1.6;
      color: var(--color-text, #ffffff);
      margin: 0;
    }

    .kpis-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .kpi-card {
      background: var(--bg-card, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      border-color: var(--color-primary-semi, rgba(0, 122, 255, 0.3));
    }

    .stat-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--color-primary-soft, rgba(0, 122, 255, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary, #007aff);
    }

    .kpi-icon {
      font-size: 20px;
    }

    .stat-meta {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 4px;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .stat-value-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      width: 100%;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-text, #ffffff);
    }

    .stat-trend {
      font-size: 12px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--color-text-muted, #8e8e93);
    }

    .stat-trend.trend-up {
      color: #34c759;
      background: rgba(52, 199, 89, 0.1);
    }

    .stat-trend.trend-stable {
      color: #007aff;
      background: rgba(0, 122, 255, 0.1);
    }

    .objectives-container {
      background: var(--bg-card, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .section-icon {
      color: var(--color-primary, #007aff);
      font-size: 18px;
    }

    .section-header h4 {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-text, #ffffff);
      margin: 0;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    .objectives-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .objectives-table th {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    }

    .objectives-table td {
      padding: 16px;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
      font-size: 14px;
      color: var(--color-text, #ffffff);
      vertical-align: middle;
    }

    .objective-title strong {
      font-weight: 600;
      color: var(--color-text, #ffffff);
    }

    .objective-measure {
      color: var(--color-text-semi, #e5e5ea);
    }

    .avatar-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .avatar-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-primary-soft, rgba(0, 122, 255, 0.15));
      color: var(--color-primary, #007aff);
      font-size: 10px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0, 122, 255, 0.3);
    }

    .owner-name {
      font-size: 13px;
      color: var(--color-text, #ffffff);
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
export class PortfolioWorkspaceOverviewComponent implements OnInit {
  description = portfolioSummary.description;
  kpis = portfolioSummary.kpis;
  objectives = portfolioSummary.objectives;

  ngOnInit(): void {}

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
