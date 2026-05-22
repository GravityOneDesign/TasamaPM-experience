import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { portfolioSummary } from './portfolio-workspace.data';
import { PortfolioWorkspaceOverviewComponent } from './portfolio-workspace-overview.component';
import { PortfolioWorkspacePlanComponent } from './portfolio-workspace-plan.component';
import { PortfolioWorkspaceRegistersComponent } from './portfolio-workspace-registers.component';
import { PortfolioWorkspaceReportsComponent } from './portfolio-workspace-reports.component';
import { PortfolioWorkspaceFrameworkComponent } from './portfolio-workspace-framework.component';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';

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
    PortfolioWorkspaceFrameworkComponent,
    PmConsoleIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="portfolio-workspace-page-container">
      
      <!-- Standard Folder-Tabs Layout Canvas -->
      <div class="pm-projects-shell" style="flex: 1; min-height: 0;">
        <!-- Horizontal Sliding Tab Navigation Bar -->
        <div 
          class="pm-register-tabs" 
          role="tablist" 
          aria-label="Portfolio workspace tabs"
          [style.--register-tab-left]="portfolioTabIndicatorLeft" 
          [style.--register-tab-width]="portfolioTabIndicatorWidth"
        >
          <span class="pm-register-tab-indicator" aria-hidden="true"></span>
          @for (tab of tabs; track tab.id) {
            <button
              class="pm-register-tab"
              [class.active]="activeTab === tab.id"
              [class.is-disabled]="tab.id === 'performance'"
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab === tab.id"
              [style.width]="portfolioTabWidth(tab.id)"
              [disabled]="tab.id === 'performance'"
              (click)="setActiveTab(tab.id)"
            >
              <span class="pm-register-tab-icon">
                <span [pmConsoleIcon]="tab.icon"></span>
              </span>
              <span class="pm-register-tab-copy"><strong>{{ tab.label }}</strong></span>
            </button>
          }
        </div>

        <!-- Scrollable Tab Content Outlet inside white Board Container -->
        <div class="pm-projects-board">
          <main class="pm-projects-board-body portfolio-workspace-body">
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
      </div>

    </div>
  `,
  styles: [`
    .portfolio-workspace-page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: transparent;
      color: #202633;
      padding: 16px 24px 24px 24px;
    }

    /* Scrollable Outlet Body */
    .portfolio-workspace-body {
      flex-grow: 1;
      overflow-y: auto;
      background: #ffffff;
      padding: 20px 10px 10px;
    }
  `]
})
export class PortfolioWorkspaceComponent {
  portfolioName = portfolioSummary.name;
  owner = portfolioSummary.owner;
  sponsor = portfolioSummary.sponsor;

  activeTab: WorkspaceTab = 'overview';

  tabs = [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'plan', label: 'Portfolio Plan', icon: 'calendar' },
    { id: 'framework', label: 'Framework & Configuration', icon: 'settings' },
    { id: 'registers', label: 'Program & Project Register', icon: 'clipboard-list' },
    { id: 'reports', label: 'Reports', icon: 'file-text' },
    { id: 'performance', label: 'Portfolio Performance', icon: 'activity' },
  ] as const;

  get portfolioTabIndex(): number {
    return Math.max(0, ['overview', 'plan', 'framework', 'registers', 'reports', 'performance'].indexOf(this.activeTab));
  }

  get portfolioTabIndicatorLeft(): string {
    const order: WorkspaceTab[] = ['overview', 'plan', 'framework', 'registers', 'reports', 'performance'];
    const widths: Record<WorkspaceTab, number> = {
      overview: 135,
      plan: 165,
      framework: 260,
      registers: 260,
      reports: 130,
      performance: 220,
    };
    const left = order.slice(0, this.portfolioTabIndex).reduce((total, tab) => total + widths[tab], 0);
    return `${left}px`;
  }

  get portfolioTabIndicatorWidth(): string {
    const widths: Record<WorkspaceTab, number> = {
      overview: 135,
      plan: 165,
      framework: 260,
      registers: 260,
      reports: 130,
      performance: 220,
    };
    return `${widths[this.activeTab]}px`;
  }

  portfolioTabWidth(id: WorkspaceTab): string {
    const widths: Record<WorkspaceTab, number> = {
      overview: 135,
      plan: 165,
      framework: 260,
      registers: 260,
      reports: 130,
      performance: 220,
    };
    return `${widths[id]}px`;
  }

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
