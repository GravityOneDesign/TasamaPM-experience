import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioManagerLandingCardsComponent } from './shared/portfolio-manager-landing-cards.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleIconService } from './pm-console-icon.service';
import { portfolioManagerSteps, Pm101Step } from './pm-console-pm101-steps';
import { iconName } from './pm-console-icon.utils';
import { PmConsoleMountOptions } from './pm-console.types';
import { PortfolioManagerActionsComponent } from './portfolio-manager-actions.component';

const reportStatusHistory = [
  { project: 'UAE Research Map', dueLabel: 'On track', dueTone: 'green', trend: [{ label: 'Mar', status: 'submitted' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'submitted' }] },
  { project: 'Vision 2030', dueLabel: 'Overdue 5 days', dueTone: 'red', trend: [{ label: 'Mar', status: 'attention' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'overdue' }] },
  { project: 'NEOM Integration', dueLabel: 'Due today', dueTone: 'amber', trend: [{ label: 'Mar', status: 'attention' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'due' }] },
  { project: 'Smart City Alpha', dueLabel: 'On track', dueTone: 'green', trend: [{ label: 'Mar', status: 'attention' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'submitted' }] },
  { project: 'PMO Capability', dueLabel: 'Due this week', dueTone: 'amber', trend: [{ label: 'Mar', status: 'submitted' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'draft' }] },
  { project: 'Counter Terrorism Operations', dueLabel: 'Overdue 2 days', dueTone: 'red', trend: [{ label: 'Mar', status: 'submitted' }, { label: 'Apr', status: 'attention' }, { label: 'May', status: 'overdue' }] },
];

@Component({
  selector: 'app-portfolio-manager-landing',
  standalone: true,
  imports: [CommonModule, PortfolioManagerLandingCardsComponent, PmConsoleIconComponent, PortfolioManagerActionsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas pm101-locked-canvas pm101-operational-canvas">
      <div class="page-motion-host">
        <div class="content-grid pm101-locked-grid pm101-operational-grid">
          <div class="left-column">
            <section class="workspace-panel pm101-locked-workspace pm101-operational-workspace">
              <div class="workspace-shell-head pm101-locked-shell-head pm101-operational-shell-head">
                <img class="workspace-line-art" src="./assets/workspace-line-art.svg" alt="" aria-hidden="true" />
                <div class="workspace-shell-actions" aria-label="Workspace utilities">
                  <button class="workspace-filter-button" type="button" aria-label="Refresh workspace">
                    <span class="icon" aria-hidden="true"><i data-lucide="refresh-cw"></i></span>
                  </button>
                  <button class="workspace-filter-button" type="button" aria-label="Expand workspace">
                    <span class="icon" aria-hidden="true"><i data-lucide="expand"></i></span>
                  </button>
                </div>
                <div class="workspace-locked-title-row">
                  <span class="workspace-pane-icon" aria-hidden="true">
                    <img src="./assets/client-logo-icon.svg" alt="" />
                  </span>
                  <div class="workspace-title">
                    <h2>Welcome!</h2>
                    <p>Track portfolio health, clear pending approvals, and stay across all programs and projects in one place.</p>
                  </div>
                </div>
                <div class="workspace-tabs" role="tablist" aria-label="Workspace view">
                  <button [class.active]="selectedTab === 'overview'" type="button" [attr.aria-selected]="selectedTab === 'overview' ? 'true' : 'false'" (click)="goToOverview()">
                    <span class="icon" aria-hidden="true"><i data-lucide="book-open"></i></span>
                    <span>Overview</span>
                  </button>
                  <button [class.active]="selectedTab === 'actions'" type="button" [attr.aria-selected]="selectedTab === 'actions' ? 'true' : 'false'" (click)="goToActions()">
                    <span class="icon" aria-hidden="true"><i data-lucide="list-checks"></i></span>
                    <span>Actions</span>
                  </button>
                </div>
              </div>

              <div class="workspace-body">
                @if (selectedTab === 'overview') {
                  <div class="pm101-view pm101-operational-view" data-work-view="pm101">
                    <app-portfolio-manager-landing-cards (onOverviewClick)="openAssignedProjectWorkspace()" />
                    <div class="pm101-journey-head">
                      <span>Portfolio Overview PM101 path</span>
                      <h3>Your portfolio management journey</h3>
                      <p>Configure your portfolio, manage delivery and report progress, all in one place.</p>
                    </div>
                    <div class="pm101-flow" aria-label="PM 101 project delivery flow">
                      <ol class="pm101-step-list" [style.--pm101-cols]="stepsToRender.length">
                        @for (step of stepsToRender; track step.title; let index = $index) {
                          <li class="pm101-step">
                            <article class="pm101-card" [class.pm101-card-coming-soon]="step.comingSoon">
                              @if (step.comingSoon) {
                                <div class="coming-soon-overlay">
                                  <span class="coming-soon-badge">Coming soon</span>
                                </div>
                              }
                              <span class="pm101-card-icon">
                                <span [pmConsoleIcon]="iconName(step.icon)" aria-hidden="true"></span>
                              </span>
                              <strong>{{ step.title }}</strong>
                              <p>{{ step.body }}</p>
                              <span [class]="'pm101-decor pm101-decor-' + step.decor" aria-hidden="true">
                                @for (asset of step.decorAssets; track asset; let assetIndex = $index) {
                                  <img class="pm101-decor-asset pm101-decor-asset-{{ assetIndex + 1 }}" [src]="asset" alt="" />
                                }
                              </span>
                              @if (step.footerAction) {
                                <button class="pm101-card-footer pm101-card-footer-link" type="button" (click)="!step.comingSoon && handlePm101StepAction(step)">
                                  <span>{{ step.footerAction }}</span>
                                  <span class="pm101-card-footer-arrow" aria-hidden="true"><i data-lucide="chevron-right"></i></span>
                                </button>
                              }
                            </article>
                          </li>
                        }
                      </ol>
                    </div>
                  </div>
                } @else {
                  <app-portfolio-manager-actions />
                }
              </div>
            </section>
          </div>

          <div class="right-column portfolio-frontdoor pm101-locked-right">
            <section class="top-deck" aria-label="PM front door actions" data-tour-target="frontdoor-actions">
              <button class="action-card workspace-command" type="button" (click)="openAssignedProjectWorkspace()">
                <span class="action-icon"><img src="./assets/workspace-card-box.svg" alt="" aria-hidden="true" /></span>
                <span class="action-copy"><strong>Workspaces</strong><small>Open project rooms</small></span>
                <span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span>
              </button>
              <button class="action-card learning-command is-unavailable" type="button" disabled aria-disabled="true" title="Learning Hub coming soon">
                <span class="action-icon"><img src="./assets/workspace-card-notebook.svg" alt="" aria-hidden="true" /></span>
                <span class="action-copy"><strong>Learning Hub</strong><small>Guides and playbooks</small></span>
                <span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span>
              </button>
            </section>
            <section class="side-card report-widget portfolio-report-widget" data-tour-target="right-report-widget">
              <div class="report-widget-head">
                <div>
                  <h2>Reporting trends</h2>
                  <small>Overview of report health at a portfolio, program and project level</small>
                </div>
              </div>
              <div class="report-trend-list">
                <!-- Card 1: Portfolio report history -->
                <article class="report-trend-row green">
                  <div class="report-trend-row-head">
                    <strong>Portfolio report history</strong>
                  </div>
                  <div class="report-trend" style="--report-trend-count:3" aria-label="Status report trend">
                    <span class="report-trend-point on-track">
                      <span class="report-status-icon on-track" aria-hidden="true">
                        <span class="icon"><i data-lucide="circle-check"></i></span>
                      </span>
                      <small>Mar</small>
                    </span>
                    <span class="report-trend-point alert">
                      <span class="report-status-icon alert" aria-hidden="true">
                        <span class="icon"><i data-lucide="triangle-alert"></i></span>
                      </span>
                      <small>Apr</small>
                    </span>
                    <span class="report-trend-point off-track">
                      <span class="report-status-icon off-track" aria-hidden="true">
                        <span class="icon"><i data-lucide="circle-x"></i></span>
                      </span>
                      <small>May</small>
                    </span>
                  </div>
                  <div class="report-trend-row-foot" style="margin-top: 4px;">
                    <span class="report-row-due">
                      <span class="icon" aria-hidden="true"><i data-lucide="history"></i></span>
                      <span>Your portfolio status has been stable</span>
                    </span>
                  </div>
                </article>

                <!-- Section Subheading -->
                <div class="report-section-divider">Program & Portfolio Reporting Trends</div>

                <!-- Card 2: Report completion rate -->
                <article class="report-trend-row green">
                  <div class="report-trend-row-head">
                    <strong>Report completion rate</strong>
                  </div>
                  <div class="report-metrics-grid">
                    <div class="report-metric-cell">
                      <small>This month:</small>
                      <strong>74%</strong>
                    </div>
                    <div class="report-metric-cell">
                      <small>Last month:</small>
                      <strong>89%</strong>
                    </div>
                    <div class="report-metric-cell">
                      <small>Change:</small>
                      <strong class="change-down"><span class="arrow">↓</span> 15%</strong>
                    </div>
                  </div>
                </article>

                <!-- Card 3: Status distribution -->
                <article class="report-trend-row amber">
                  <div class="report-trend-row-head">
                    <strong>Status distribution</strong>
                    <span class="report-date-label">Mar 2026</span>
                  </div>
                  <div class="report-status-grid">
                    <div class="status-cell">
                      <div class="status-value-row">
                        <span class="report-status-icon on-track" aria-hidden="true">
                          <span class="icon"><i data-lucide="circle-check"></i></span>
                        </span>
                        <strong>12</strong>
                      </div>
                      <small>On track</small>
                    </div>
                    <div class="status-cell">
                      <div class="status-value-row">
                        <span class="report-status-icon alert" aria-hidden="true">
                          <span class="icon"><i data-lucide="triangle-alert"></i></span>
                        </span>
                        <strong>4</strong>
                      </div>
                      <small>Delayed</small>
                    </div>
                    <div class="status-cell">
                      <div class="status-value-row">
                        <span class="report-status-icon off-track" aria-hidden="true">
                          <span class="icon"><i data-lucide="circle-x"></i></span>
                        </span>
                        <strong>1</strong>
                      </div>
                      <small>Critical</small>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .report-section-divider {
      color: #0b0b0b;
      font-size: 13px;
      font-weight: 600;
      line-height: 20px;
      margin: 8px 0 0;
    }
    .report-metrics-grid,
    .report-status-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      background: #ffffff;
      border: 1px solid rgba(223, 228, 238, 0.86);
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(25, 33, 61, 0.045);
      min-height: 48px;
      padding: 6px 0;
      width: 100%;
    }
    .report-metric-cell,
    .status-cell {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 4px 8px 4px 12px;
      position: relative;
    }
    .report-metric-cell:not(:last-child)::after,
    .status-cell:not(:last-child)::after {
      content: "";
      background: #e4e4e4;
      height: 24px;
      position: absolute;
      right: 0;
      top: calc(50% - 12px);
      width: 1px;
    }
    .report-metric-cell small,
    .status-cell small {
      color: #687182;
      font-size: 10.5px;
      font-weight: 500;
      line-height: 14px;
    }
    .report-metric-cell strong {
      color: #252a34;
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      margin-top: 2px;
    }
    .report-metric-cell strong.change-down {
      color: #303645;
    }
    .report-metric-cell strong.change-down .arrow {
      color: #e05252;
      font-weight: bold;
    }
    .report-date-label {
      color: #687182;
      font-size: 11px;
      font-weight: 400;
      line-height: 20px;
    }
    .status-value-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .status-value-row strong {
      color: #252a34;
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
    }
    .status-cell small {
      font-size: 11px;
      margin-top: 1px;
      padding-left: 22px;
    }
    .status-cell .report-status-icon {
      background: transparent;
      height: 16px;
      width: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .status-cell .report-status-icon.on-track {
      color: #22a06b;
    }
    .status-cell .report-status-icon.alert {
      color: #e87722;
    }
    .status-cell .report-status-icon.off-track {
      color: #e05252;
    }
    .status-cell .report-status-icon .icon,
    .status-cell .report-status-icon svg {
      height: 16px;
      width: 16px;
    }
    .pm101-card-coming-soon {
      position: relative !important;
      cursor: default !important;
    }
    .coming-soon-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
      z-index: 10;
      pointer-events: none;
    }
    .pm101-card-coming-soon:hover .coming-soon-overlay {
      opacity: 1;
      pointer-events: auto;
    }
    .coming-soon-badge {
      background: rgba(15, 23, 42, 0.9);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(10px);
      transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .pm101-card-coming-soon:hover .coming-soon-badge {
      transform: translateY(0);
    }
  `],
})
export class PortfolioManagerLandingComponent implements AfterViewChecked {
  @Output() readonly consoleStateChange = new EventEmitter<Partial<PmConsoleMountOptions>>();

  selectedTab: 'overview' | 'actions' = 'overview';
  readonly stepsToRender = portfolioManagerSteps;
  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly iconsService: PmConsoleIconService,
  ) {}

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  iconName(name: string): string {
    return iconName(name);
  }

  goToActions(): void {
    this.selectedTab = 'actions';
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  goToOverview(): void {
    this.selectedTab = 'overview';
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  openAssignedProjectWorkspace(): void {
    this.consoleStateChange.emit({
      selectedPage: 'portfolio-workspace',
      portfolioWorkspaceTab: 'overview',
    });
  }

  handlePm101StepAction(step: Pm101Step): void {
    const tabId = step.footerActionId;
    if (tabId === 'framework' || tabId === 'registers' || tabId === 'reports') {
      this.consoleStateChange.emit({
        selectedPage: 'portfolio-workspace',
        portfolioWorkspaceTab: tabId,
      });
    }
  }

  openReport(projectName: string): void {
    // Navigate to reports tab of portfolio workspace, or just open portfolio workspace reports
    this.consoleStateChange.emit({
      selectedPage: 'portfolio-workspace',
      portfolioWorkspaceTab: 'reports',
    });
  }

  get visibleReportRows() {
    const rows = reportStatusHistory;
    const order = ['UAE Research Map', 'Vision 2030', 'NEOM Integration'];
    return order.map((project) => {
      const row = rows.find((r) => r.project === project);
      if (!row) return undefined;
      if (row.project === 'Vision 2030') {
        return { ...row, dueLabel: 'Overdue by 5 days', dueTone: 'red' };
      }
      if (row.project === 'NEOM Integration') {
        return { ...row, dueTone: 'green' };
      }
      return row;
    }).filter((row): row is (typeof reportStatusHistory)[number] => Boolean(row));
  }

  reportDueToneLabel(tone: string): string {
    if (tone === 'red') return 'Off track';
    if (tone === 'amber') return 'Alert';
    if (tone === 'green') return 'On track';
    return 'Review';
  }

  reportStatusTone(status: string): string {
    if (status === 'missed' || status === 'overdue') return 'off-track';
    if (status === 'due' || status === 'attention' || status === 'draft') return 'alert';
    return 'on-track';
  }

  reportStatusIcon(status: string): string {
    return this.reportStatusTone(status) === 'off-track' ? 'circle-x' : this.reportStatusTone(status) === 'alert' ? 'triangle-alert' : 'circle-check';
  }

  reportDueText(report: { dueLabel: string }): string {
    return report.dueLabel === 'Overdue 5 days' ? 'Overdue by 5 days' : report.dueLabel;
  }
}
