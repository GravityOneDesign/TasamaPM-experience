import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioWorkspaceOverviewComponent } from './portfolio-workspace-overview.component';
import { PortfolioWorkspaceRegistersComponent } from './portfolio-workspace-registers.component';
import { PortfolioWorkspaceReportsComponent } from './portfolio-workspace-reports.component';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleModeTabsComponent, type PmConsoleModeTabItem } from '../shared/pm-console-mode-tabs.component';

type WorkspaceTab = 'overview' | 'registers' | 'reports';
const portfolioWorkspaceTabOrder: WorkspaceTab[] = ['overview', 'registers', 'reports'];
const portfolioWorkspaceTabs: readonly PmConsoleModeTabItem[] = [
  { id: 'overview', label: 'Portfolio Profile', icon: 'grid-3x3', widthPx: 184 },
  { id: 'registers', label: 'Registers', icon: 'clipboard-list', widthPx: 140 },
  { id: 'reports', label: 'Reports', icon: 'file-text', widthPx: 128 },
];

@Component({
  selector: 'app-portfolio-workspace',
  standalone: true,
  imports: [
    CommonModule,
    PortfolioWorkspaceOverviewComponent,
    PortfolioWorkspaceRegistersComponent,
    PortfolioWorkspaceReportsComponent,
    PmConsoleIconComponent,
    PmConsoleModeTabsComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="portfolio-workspace-page-container">
      <div class="project-plan-card-frame portfolio-workspace-frame">
        <header class="workspace-register-header portfolio-workspace-header" [attr.aria-label]="portfolioName">
          <img class="workspace-register-header-art" src="./assets/workspace-line-art.svg" alt="" aria-hidden="true" />
          <div class="workspace-register-title-row">
            <button class="workspace-register-back" type="button" aria-label="Go back" (click)="goBack()">
              <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
            </button>
            <h1>{{ portfolioName }}</h1>
          </div>
          <app-pm-console-mode-tabs
            ariaLabel="Portfolio workspace tabs"
            [tabs]="tabs"
            [activeId]="activeTab"
            (tabSelected)="setActiveTabFromModeTab($event)"
          ></app-pm-console-mode-tabs>
        </header>

        <main class="portfolio-workspace-body">
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
      background: #F1F7FA;
      color: #202633;
      padding: 16px 24px 24px 24px;
    }

    .portfolio-workspace-frame {
      flex: 1;
      min-height: 0;
    }

    .portfolio-workspace-body {
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow-y: auto;
      background: #ffffff;
      padding: 10px 24px 18px;
    }
  `]
})
export class PortfolioWorkspaceComponent {
  portfolioName = 'Safe Security Portfolio Workspace';
  readonly tabs = portfolioWorkspaceTabs;

  @Input() activeTab: WorkspaceTab = 'overview';
  @Output() readonly activeTabChange = new EventEmitter<WorkspaceTab>();
  @Output() readonly back = new EventEmitter<void>();

  goBack(): void {
    this.back.emit();
  }

  setActiveTab(tab: WorkspaceTab): void {
    this.activeTab = tab;
    this.activeTabChange.emit(tab);
  }

  setActiveTabFromModeTab(tabId: string): void {
    if (!portfolioWorkspaceTabOrder.includes(tabId as WorkspaceTab)) return;
    this.setActiveTab(tabId as WorkspaceTab);
  }
}
