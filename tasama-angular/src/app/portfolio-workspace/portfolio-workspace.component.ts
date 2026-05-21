import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { portfolioSummary } from './portfolio-workspace.data';
import { PortfolioWorkspaceOverviewComponent } from './portfolio-workspace-overview.component';
import { PortfolioWorkspacePlanComponent } from './portfolio-workspace-plan.component';
import { PortfolioWorkspaceRegistersComponent } from './portfolio-workspace-registers.component';
import { PortfolioWorkspaceReportsComponent } from './portfolio-workspace-reports.component';
import { PortfolioWorkspaceFrameworkComponent } from './portfolio-workspace-framework.component';

type WorkspaceTab = 'overview' | 'plan' | 'registers' | 'reports' | 'framework' | 'performance';

@Component({
  selector: 'app-portfolio-workspace',
  standalone: true,
  imports: [
    CommonModule,
    PortfolioWorkspaceOverviewComponent,
    PortfolioWorkspacePlanComponent,
    PortfolioWorkspaceRegistersComponent,
    PortfolioWorkspaceReportsComponent,
    PortfolioWorkspaceFrameworkComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="portfolio-workspace-page-container">
      
      <!-- Portfolio Page Header -->
      <header class="portfolio-workspace-header">
        <div class="header-main-info">
          <span class="page-eyebrow">PORTFOLIO WORKSPACE</span>
          <h1 class="page-title">{{ portfolioName }}</h1>
        </div>
        
        <div class="header-chips-row">
          <div class="meta-chip">
            <span class="chip-label">Portfolio Owner</span>
            <div class="chip-content">
              <div class="avatar-circle font-owner">{{ getInitials(owner) }}</div>
              <strong class="chip-name">{{ owner }}</strong>
            </div>
          </div>

          <span class="chip-divider"></span>

          <div class="meta-chip">
            <span class="chip-label">Portfolio Sponsor</span>
            <div class="chip-content">
              <div class="avatar-circle font-sponsor">{{ getInitials(sponsor) }}</div>
              <strong class="chip-name">{{ sponsor }}</strong>
            </div>
          </div>
        </div>
      </header>

      <!-- Horizontal Tab Navigation Bar -->
      <div class="pm-register-tabs portfolio-top-tabs">
        <button
          class="pm-register-tab"
          [class.is-active]="activeTab === 'overview'"
          type="button"
          (click)="setActiveTab('overview')"
        >
          <span>Overview</span>
        </button>
        <button
          class="pm-register-tab"
          [class.is-active]="activeTab === 'plan'"
          type="button"
          (click)="setActiveTab('plan')"
        >
          <span>Portfolio Plan</span>
        </button>
        <button
          class="pm-register-tab"
          [class.is-active]="activeTab === 'registers'"
          type="button"
          (click)="setActiveTab('registers')"
        >
          <span>Registers</span>
        </button>
        <button
          class="pm-register-tab"
          [class.is-active]="activeTab === 'reports'"
          type="button"
          (click)="setActiveTab('reports')"
        >
          <span>Reports</span>
        </button>
        <button
          class="pm-register-tab"
          [class.is-active]="activeTab === 'framework'"
          type="button"
          (click)="setActiveTab('framework')"
        >
          <span>Framework & Configuration</span>
        </button>
        <button
          class="pm-register-tab is-disabled"
          [class.is-active]="activeTab === 'performance'"
          type="button"
          disabled
          aria-disabled="true"
          title="Portfolio Performance is disabled"
        >
          <span>Portfolio Performance</span>
        </button>
      </div>

      <!-- Scrollable Tab Content Outlet -->
      <main class="portfolio-workspace-body">
        @switch (activeTab) {
          @case ('overview') {
            <app-portfolio-workspace-overview></app-portfolio-workspace-overview>
          }
          @case ('plan') {
            <app-portfolio-workspace-plan></app-portfolio-workspace-plan>
          }
          @case ('registers') {
            <app-portfolio-workspace-registers></app-portfolio-workspace-registers>
          }
          @case ('reports') {
            <app-portfolio-workspace-reports></app-portfolio-workspace-reports>
          }
          @case ('framework') {
            <app-portfolio-workspace-framework></app-portfolio-workspace-framework>
          }
        }
      </main>

    </div>
  `,
  styles: [`
    .portfolio-workspace-page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: transparent;
      color: var(--color-text, #ffffff);
    }

    /* Page Header */
    .portfolio-workspace-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px 24px;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
    }

    .header-main-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .page-eyebrow {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--color-primary, #007aff);
      text-transform: uppercase;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--color-text, #ffffff);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .header-chips-row {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--bg-card, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
      border-radius: 12px;
      padding: 10px 18px;
      backdrop-filter: blur(10px);
    }

    .meta-chip {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .chip-label {
      font-size: 9.5px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .chip-content {
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
      background: rgba(0, 122, 255, 0.15);
      color: #007aff;
      border: 1.5px solid rgba(0, 122, 255, 0.35);
    }

    .font-sponsor {
      background: rgba(255, 159, 10, 0.1);
      color: #ff9f0a;
      border: 1.5px solid rgba(255, 159, 10, 0.25);
    }

    .chip-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text, #ffffff);
    }

    .chip-divider {
      width: 1px;
      height: 28px;
      background: var(--border-color, rgba(255, 255, 255, 0.08));
      align-self: center;
    }

    /* Top Tabs Styling */
    .portfolio-top-tabs.pm-register-tabs {
      background: rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      padding: 0 24px;
      display: flex;
      gap: 28px;
    }

    .portfolio-top-tabs .pm-register-tab {
      background: transparent;
      border: none;
      padding: 16px 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-muted, #8e8e93);
      cursor: pointer;
      position: relative;
      transition: color 0.15s ease;
    }

    .portfolio-top-tabs .pm-register-tab::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: transparent;
      transition: background-color 0.15s ease;
    }

    .portfolio-top-tabs .pm-register-tab:hover:not(.is-disabled) {
      color: var(--color-text, #ffffff);
    }

    .portfolio-top-tabs .pm-register-tab.is-active {
      color: var(--color-primary, #007aff);
      font-weight: 600;
    }

    .portfolio-top-tabs .pm-register-tab.is-active::after {
      background: var(--color-primary, #007aff);
    }

    .portfolio-top-tabs .pm-register-tab.is-disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    /* Scrollable Outlet Body */
    .portfolio-workspace-body {
      flex-grow: 1;
      overflow-y: auto;
    }
  `]
})
export class PortfolioWorkspaceComponent {
  portfolioName = portfolioSummary.name;
  owner = portfolioSummary.owner;
  sponsor = portfolioSummary.sponsor;

  activeTab: WorkspaceTab = 'overview';

  setActiveTab(tab: WorkspaceTab): void {
    if (tab === 'performance') return;
    this.activeTab = tab;
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
}
