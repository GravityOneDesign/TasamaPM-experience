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
      <div class="project-plan-card-frame" style="flex: 1; min-height: 0;">
        <header class="project-plan-hero plan-builder-hero project-scope-hero project-plan-card-hero">
          <img class="project-plan-hero-art" src="./assets/workspace-line-art.svg" alt="" aria-hidden="true" />
          <div class="project-plan-hero-inner">
            <div class="project-plan-summary">
              <div class="project-plan-title plan-builder-title" style="display: flex; align-items: center; gap: 8px;">
                <button class="project-plan-back" type="button" aria-label="Go back" (click)="goBack()" style="background: transparent; border: none; padding: 0; margin: 0; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #0b0b0b;">
                  <span class="icon" aria-hidden="true" style="display: inline-flex; align-items: center; justify-content: center;"><span pmConsoleIcon="arrow-left"></span></span>
                </button>
                <h1 style="margin: 0; line-height: 24px; display: inline-flex; align-items: center;">{{ portfolioName }}</h1>
              </div>
            </div>
            
            <!-- Horizontal Sliding Tab Navigation Bar -->
            <div 
              class="pm-register-tabs" 
              role="tablist" 
              aria-label="Portfolio workspace tabs"
              [style.--register-tab-left]="portfolioTabIndicatorLeft" 
              [style.--register-tab-width]="portfolioTabIndicatorWidth"
              style="position: absolute; bottom: 0; left: 16px; margin: 0; z-index: 4;"
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
          </div>
        </header>

        <!-- Contained Tab Content Outlet inside white Board Container -->
        <main class="portfolio-workspace-body" style="grid-row: 2; display: flex; flex-direction: column; overflow: hidden; background: #ffffff; padding: 10px 24px 18px 24px;">
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
  `,
  styles: [`
    .portfolio-workspace-page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background:
        radial-gradient(circle at 29% 0%, rgba(16, 6, 159, 0.055) 0, rgba(16, 6, 159, 0) 220px),
        linear-gradient(180deg, #fbfbff 0%, #f8f9fc 42%);
      color: #202633;
      padding: 16px 24px 24px 24px;
    }

    /* Contained Outlet Body */
    .portfolio-workspace-body {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #ffffff;
      padding: 10px 24px 18px;
    }
  `]
})
export class PortfolioWorkspaceComponent {
  portfolioName = 'Safe Security Portfolio Workspace';
  owner = portfolioSummary.owner;
  sponsor = portfolioSummary.sponsor;

  @Input() activeTab: WorkspaceTab = 'overview';
  @Output() readonly activeTabChange = new EventEmitter<WorkspaceTab>();
  @Output() readonly back = new EventEmitter<void>();

  goBack(): void {
    this.back.emit();
  }


  tabs = [
    { id: 'overview', label: 'Portfolio Profile', icon: 'grid' },
    { id: 'registers', label: 'Registers', icon: 'clipboard-list' },
    { id: 'reports', label: 'Reports', icon: 'file-text' },
  ] as const;

  get portfolioTabIndex(): number {
    return Math.max(0, ['overview', 'registers', 'reports'].indexOf(this.activeTab));
  }

  get portfolioTabIndicatorLeft(): string {
    const order: WorkspaceTab[] = ['overview', 'registers', 'reports'];
    const widths: Record<WorkspaceTab, number> = {
      overview: 185,
      registers: 140,
      reports: 130,
    };
    const left = order.slice(0, this.portfolioTabIndex).reduce((total, tab) => total + widths[tab], 0);
    return `${left}px`;
  }

  get portfolioTabIndicatorWidth(): string {
    const widths: Record<WorkspaceTab, number> = {
      overview: 185,
      registers: 140,
      reports: 130,
    };
    return `${widths[this.activeTab]}px`;
  }

  portfolioTabWidth(id: WorkspaceTab): string {
    const widths: Record<WorkspaceTab, number> = {
      overview: 185,
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
