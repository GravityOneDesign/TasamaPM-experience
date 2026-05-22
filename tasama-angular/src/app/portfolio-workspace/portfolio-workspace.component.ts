import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { portfolioSummary } from './portfolio-workspace.data';
import { PortfolioWorkspaceOverviewComponent } from './portfolio-workspace-overview.component';
import { PortfolioWorkspaceRegistersComponent } from './portfolio-workspace-registers.component';
import { PortfolioWorkspaceReportsComponent } from './portfolio-workspace-reports.component';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';

type WorkspaceTab = 'overview' | 'registers' | 'reports';

@Component({
  selector: 'app-portfolio-workspace',
  standalone: true,
  imports: [
    CommonModule,
    PortfolioWorkspaceOverviewComponent,
    PortfolioWorkspaceRegistersComponent,
    PortfolioWorkspaceReportsComponent,
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
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab === tab.id"
              [style.width]="portfolioTabWidth(tab.id)"
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
              @case ('registers') {
                <app-portfolio-workspace-registers></app-portfolio-workspace-registers>
              }
              @case ('reports') {
                <app-portfolio-workspace-reports></app-portfolio-workspace-reports>
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

  @Input() activeTab: WorkspaceTab = 'overview';
  @Output() readonly activeTabChange = new EventEmitter<WorkspaceTab>();

  tabs = [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'registers', label: 'Registers', icon: 'clipboard-list' },
    { id: 'reports', label: 'Reports', icon: 'file-text' },
  ] as const;

  get portfolioTabIndex(): number {
    return Math.max(0, ['overview', 'registers', 'reports'].indexOf(this.activeTab));
  }

  get portfolioTabIndicatorLeft(): string {
    const order: WorkspaceTab[] = ['overview', 'registers', 'reports'];
    const widths: Record<WorkspaceTab, number> = {
      overview: 135,
      registers: 140,
      reports: 130,
    };
    const left = order.slice(0, this.portfolioTabIndex).reduce((total, tab) => total + widths[tab], 0);
    return `${left}px`;
  }

  get portfolioTabIndicatorWidth(): string {
    const widths: Record<WorkspaceTab, number> = {
      overview: 135,
      registers: 140,
      reports: 130,
    };
    return `${widths[this.activeTab]}px`;
  }

  portfolioTabWidth(id: WorkspaceTab): string {
    const widths: Record<WorkspaceTab, number> = {
      overview: 135,
      registers: 140,
      reports: 130,
    };
    return `${widths[id]}px`;
  }

  setActiveTab(tab: WorkspaceTab): void {
    this.activeTab = tab;
    this.activeTabChange.emit(tab);
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
