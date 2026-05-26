import { ChangeDetectionStrategy, Component, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { PmConsoleIconService } from './pm-console-icon.service';
import {
  pmoFrontdoorActions,
  pmoFrontdoorDigestSections,
  pmoFrontdoorHealthRows,
  pmoFrontdoorMetrics,
  pmoFrontdoorQuickLinks,
  pmoFrontdoorTabs,
  pmoFrontdoorWorkFilters,
  pmoFrontdoorWorkItems,
  type PmoFrontdoorQuickLink,
  type PmoFrontdoorTab,
} from './pmo-frontdoor.data';
import type { ProjectOption } from './pm-console.types';
import type { PmoGovernanceWorkspaceTarget } from './pmo-governance-workspace.data';
import { PortfolioManagerActionsComponent } from './portfolio-manager-actions.component';
import { PmConsoleDigestPanelComponent } from './shared/pm-console-digest-panel.component';
import { PmConsoleFrontdoorActionCardsComponent } from './shared/pm-console-frontdoor-action-cards.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleModeTabsComponent } from './shared/pm-console-mode-tabs.component';
import { PmConsoleProjectDropdownComponent } from './shared/pm-console-project-dropdown.component';

@Component({
  selector: 'app-pmo-frontdoor',
  standalone: true,
  imports: [
    PortfolioManagerActionsComponent,
    PmConsoleDigestPanelComponent,
    PmConsoleFrontdoorActionCardsComponent,
    PmConsoleIconComponent,
    PmConsoleModeTabsComponent,
    PmConsoleProjectDropdownComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas pm101-operational-canvas pmo-frontdoor-canvas">
      <div class="page-motion-host">
        <div class="content-grid pm101-operational-grid normal-pm-frontdoor-grid pmo-frontdoor-grid">
          <div class="left-column">
            <section class="workspace-panel pm101-operational-workspace normal-pm-frontdoor-workspace pmo-frontdoor-workspace">
              <div class="workspace-shell-head pm101-operational-shell-head pm101-frontdoor-assigned-shell-head normal-pm-frontdoor-shell-head pmo-frontdoor-shell-head">
                <div class="onboarding-operational-tabs">
                  <app-pm-console-mode-tabs
                    ariaLabel="PMO front door sections"
                    [tabs]="tabs"
                    [activeId]="selectedTab"
                    (tabSelected)="setTab($event)"
                  ></app-pm-console-mode-tabs>
                </div>
                <div class="workspace-shell-actions pmo-frontdoor-scope-actions" aria-label="PMO portfolio scope">
                  <app-pm-console-project-dropdown
                    label=""
                    leadingIcon="folder"
                    ariaLabel="Select PMO portfolio scope"
                    [options]="portfolioScopeOptions"
                    [value]="selectedPortfolioScope"
                    (valueChange)="setPortfolioScope($event)"
                  ></app-pm-console-project-dropdown>
                </div>
              </div>

              <div class="workspace-body normal-pm-frontdoor-body pmo-frontdoor-body">
                @if (selectedTab === 'overview') {
                  <section class="pmo-frontdoor-overview" aria-label="PMO portfolio overview">
                    <article class="pmo-performance-hero" aria-label="Portfolio performance snapshot">
                      <div class="pmo-hero-metrics" aria-label="PMO scope metrics">
                        @for (metric of metrics; track metric.label) {
                          <span class="pmo-hero-metric">
                            <strong>{{ metric.value }}</strong>
                            <span>{{ metric.label }}</span>
                          </span>
                        }
                      </div>

                      <section class="pmo-hero-health" aria-label="Portfolio and program performance">
                        <span class="pmo-hero-visual pmo-hero-visual-performance" aria-hidden="true">
                          <img class="pmo-hero-illustration pmo-hero-illustration-performance" src="assets/executive/portfolio-performing.svg" alt="" />
                        </span>
                        <div class="pmo-hero-copy">
                          <h2>How Is My Portfolio Performing?</h2>
                          @for (row of healthRows; track row.label) {
                            <div class="pmo-health-row">
                              <span>{{ row.label }}</span>
                              <div class="pmo-health-track" aria-hidden="true">
                                <i class="is-on-track"></i>
                                <i class="is-delayed"></i>
                                <i class="is-critical"></i>
                              </div>
                              <div class="pmo-health-labels">
                                <span>On Track: {{ row.onTrack }}</span>
                                <span>Delayed: {{ row.delayed }}</span>
                                <span>Critical: {{ row.critical }}</span>
                              </div>
                            </div>
                          }
                        </div>
                      </section>

                      <span class="pmo-hero-divider" aria-hidden="true"></span>

                      <section class="pmo-hero-budget" aria-label="Budget tracking snapshot">
                        <span class="pmo-hero-visual pmo-hero-visual-budget" aria-hidden="true">
                          <img class="pmo-hero-illustration pmo-hero-illustration-budget" src="assets/executive/budget-tracking.svg" alt="" />
                        </span>
                        <div class="pmo-hero-budget-copy">
                          <h2>How are we tracking against our Budgets?</h2>
                          <div class="pmo-budget-card">
                            <span>Actual Vs Planned Budget</span>
                            <div class="pmo-budget-card-body">
                              <div class="pmo-budget-bars" aria-hidden="true">
                                @for (bar of budgetBars; track $index) {
                                  <i></i>
                                }
                              </div>
                              <div class="pmo-budget-values">
                                <p><strong>$175.9M</strong><span>/ $479.9M</span></p>
                                <p><strong>40%</strong><span>of Total Budget Used</span></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </article>

                    <app-pm-console-frontdoor-action-cards
                      ariaLabel="PMO front door actions"
                      projectName="Portfolio Management Office"
                      [actions]="actions"
                      ctaMode="arrow"
                      (actionSelected)="selectAction($event)"
                    ></app-pm-console-frontdoor-action-cards>
                  </section>
                } @else if (selectedTab === 'manage-work') {
                  <app-portfolio-manager-actions
                    [workspaceTitle]="'Portfolio Management Office'"
                    searchPlaceholder="Search PMO work..."
                    [actionItems]="workItems"
                    [boardFilters]="workFilters"
                    [showTargetPicker]="false"
                    [showBoardDetailPanel]="true"
                    [openItemsInDrawer]="true"
                    todayKey="2026-05-26"
                  />
                } @else {
                  <div class="pmo-frontdoor-quicklinks quicklinks-view" data-work-view="quicklinks">
                    <section class="workspace-quick-links-view" aria-label="All Portfolios PMO quick links">
                      <h2>All Portfolios</h2>
                      <div class="selected-project-quick-link-grid">
                        @for (link of quickLinks; track link.id) {
                          <article class="selected-project-quick-link-card" [attr.data-quick-link-id]="link.id">
                            <button class="selected-project-quick-link-main" type="button" [attr.aria-label]="link.title + ' for All Portfolios'" (click)="openQuickLink(link)">
                              <span class="selected-project-quick-link-icon">
                                <span [pmConsoleIcon]="link.icon" aria-hidden="true"></span>
                              </span>
                              <span class="selected-project-quick-link-copy">
                                <strong>{{ link.title }}</strong>
                                <small>{{ link.description }}</small>
                              </span>
                            </button>
                          </article>
                        }
                      </div>
                    </section>
                  </div>
                }
              </div>
            </section>
          </div>

          <div class="right-column normal-pm-digest-column pmo-frontdoor-digest-column">
            <app-pm-console-digest-panel
              title="Welcome!"
              [subtitleLines]="welcomeSubtitle"
              heroIconName="flag"
              [heroAssetSrc]="welcomeIconSrc"
              digestTitle="Daily Digest"
              digestIconName="wand-sparkles"
              [sections]="digestSections"
            ></app-pm-console-digest-panel>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-frontdoor-grid {
        align-content: stretch;
        align-items: stretch;
      }

      .pmo-frontdoor-workspace {
        min-width: 0;
      }

      .pmo-frontdoor-workspace .pmo-frontdoor-body {
        min-height: 0;
        padding: 16px 16px 24px;
      }

      .pmo-frontdoor-shell-head .onboarding-operational-tabs {
        max-width: calc(100% - 288px);
      }

      .pmo-frontdoor-overview {
        display: grid;
        gap: 24px;
        min-width: 0;
      }

      .pmo-performance-hero {
        background:
          radial-gradient(circle at 53% 26%, rgba(12, 95, 231, 0.88) 0%, rgba(12, 95, 231, 0.45) 28%, rgba(12, 95, 231, 0) 54%),
          linear-gradient(135deg, #212179 0%, #10069f 48%, #272777 100%);
        border-radius: 12px;
        color: #ffffff;
        height: 264px;
        min-width: 0;
        overflow: hidden;
        position: relative;
      }

      .pmo-performance-hero::before {
        background-image:
          linear-gradient(30deg, transparent 49.4%, rgba(92, 207, 255, 0.15) 50%, transparent 50.6%),
          linear-gradient(150deg, transparent 49.4%, rgba(92, 207, 255, 0.15) 50%, transparent 50.6%);
        background-size: 78px 44px;
        content: "";
        inset: 42px 8px 12px;
        opacity: 0.7;
        pointer-events: none;
        position: absolute;
      }

      .pmo-performance-hero::after {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0));
        content: "";
        inset: 0;
        pointer-events: none;
        position: absolute;
      }

      .pmo-hero-metrics {
        align-items: center;
        display: flex;
        gap: 7px;
        left: 30px;
        position: absolute;
        top: 25px;
        z-index: 2;
      }

      .pmo-hero-metric {
        align-items: center;
        background: rgba(255, 255, 255, 0.09);
        border-bottom: 2px solid #addc91;
        border-radius: 6px;
        box-shadow: 0 8px 18px rgba(1, 10, 15, 0.08);
        display: inline-flex;
        gap: 7px;
        height: 37px;
        min-width: 124px;
        padding: 0 10px;
      }

      .pmo-hero-metric strong {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        line-height: 28px;
      }

      .pmo-hero-metric span {
        color: rgba(255, 255, 255, 0.95);
        font-size: 10px;
        line-height: 14px;
      }

      .pmo-hero-health,
      .pmo-hero-budget {
        align-items: center;
        display: grid;
        position: absolute;
        z-index: 2;
      }

      .pmo-hero-health {
        gap: 6px;
        grid-template-columns: 188px 242px;
        left: 30px;
        top: 72px;
        width: 437px;
      }

      .pmo-hero-budget {
        gap: 26px;
        grid-template-columns: 176px minmax(0, 235px);
        right: 30px;
        top: 71px;
        width: 437px;
      }

      .pmo-hero-visual {
        display: block;
        min-width: 0;
        overflow: hidden;
        position: relative;
      }

      .pmo-hero-visual-performance {
        height: 167px;
        width: 188px;
      }

      .pmo-hero-visual-budget {
        height: 159px;
        width: 176px;
      }

      .pmo-hero-illustration {
        display: block;
        height: auto;
        position: absolute;
        pointer-events: none;
        user-select: none;
      }

      .pmo-hero-illustration-performance {
        left: -173px;
        top: -74px;
        width: 512px;
      }

      .pmo-hero-illustration-budget {
        left: -128px;
        top: -92px;
        width: 430px;
      }

      .pmo-hero-copy,
      .pmo-hero-budget-copy {
        display: grid;
        min-width: 0;
      }

      .pmo-hero-copy {
        gap: 14px;
      }

      .pmo-hero-budget-copy {
        gap: 10px;
      }

      .pmo-hero-copy h2,
      .pmo-hero-budget-copy h2 {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
      }

      .pmo-health-row {
        display: grid;
        gap: 6px;
        min-width: 0;
      }

      .pmo-health-row > span {
        color: #ffffff;
        font-size: 7px;
        font-weight: 500;
        line-height: 10px;
      }

      .pmo-health-track {
        background: rgba(255, 255, 255, 0.18);
        border-radius: 999px;
        display: grid;
        grid-template-columns: 37% 34% 29%;
        height: 6px;
        overflow: hidden;
        width: 228px;
      }

      .pmo-health-track i {
        display: block;
        min-width: 0;
      }

      .pmo-health-track .is-on-track {
        background: #98d66f;
      }

      .pmo-health-track .is-delayed {
        background: #b69d55;
      }

      .pmo-health-track .is-critical {
        background: #9d73c9;
      }

      .pmo-health-labels {
        display: flex;
        justify-content: space-between;
        width: 228px;
      }

      .pmo-health-labels span {
        color: #ffffff;
        font-size: 6px;
        line-height: 6px;
      }

      .pmo-hero-divider {
        background: rgba(255, 255, 255, 0.76);
        border-radius: 999px;
        height: 128px;
        left: 50%;
        position: absolute;
        top: 92px;
        transform: translateX(-1px);
        width: 1px;
        z-index: 2;
      }

      .pmo-budget-card {
        background: rgba(255, 255, 255, 0.09);
        border-radius: 8px;
        display: grid;
        gap: 11px;
        min-height: 93px;
        padding: 5px 10px 5px;
      }

      .pmo-budget-card > span {
        color: #ffffff;
        font-size: 8px;
        line-height: 16px;
      }

      .pmo-budget-card-body {
        align-items: center;
        display: grid;
        gap: 16px;
        grid-template-columns: 36px minmax(0, 1fr);
      }

      .pmo-budget-bars {
        display: grid;
        gap: 3px;
      }

      .pmo-budget-bars i {
        background: linear-gradient(90deg, rgba(153, 180, 255, 0.95), rgba(255, 255, 255, 0.35));
        border-radius: 999px;
        height: 3px;
      }

      .pmo-budget-values {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .pmo-budget-values p {
        align-items: baseline;
        color: #ffffff;
        display: flex;
        gap: 5px;
        margin: 0;
        min-width: 0;
      }

      .pmo-budget-values strong {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        line-height: 28px;
      }

      .pmo-budget-values span {
        color: rgba(255, 255, 255, 0.9);
        font-size: 8px;
        line-height: 14px;
      }

      .pmo-frontdoor-quicklinks {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        min-width: 0;
        overflow: auto !important;
      }

      .pmo-frontdoor-quicklinks .workspace-quick-links-view {
        padding-top: 0;
      }

      .pmo-frontdoor-quicklinks .selected-project-quick-link-grid {
        align-items: stretch;
        grid-auto-rows: minmax(130px, auto);
      }

      .pmo-frontdoor-quicklinks .selected-project-quick-link-card,
      .pmo-frontdoor-quicklinks .selected-project-quick-link-main {
        height: 100%;
        min-height: 0;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-section-label {
        font-size: 12px;
        font-weight: 400;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-content {
        gap: 24px;
        margin-top: 20px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-list {
        gap: 8px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-item {
        font-size: 12px;
        line-height: 16px;
        min-height: 56px;
        padding: 8px 12px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-item strong {
        color: #10069f;
        font-weight: 500;
      }

      @media (max-width: 1180px) {
        .pmo-performance-hero {
          height: auto;
          min-height: 440px;
          padding: 24px;
        }

        .pmo-hero-metrics,
        .pmo-hero-health,
        .pmo-hero-budget,
        .pmo-hero-divider {
          left: auto;
          position: relative;
          right: auto;
          top: auto;
          transform: none;
        }

        .pmo-hero-metrics {
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .pmo-hero-health,
        .pmo-hero-budget {
          margin-top: 20px;
          width: min(100%, 520px);
        }

        .pmo-hero-divider {
          display: none;
        }
      }

      @media (max-width: 780px) {
        .pmo-hero-health,
        .pmo-hero-budget {
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-frontdoor-scope-actions {
          display: none;
        }

        .pmo-frontdoor-shell-head .onboarding-operational-tabs {
          max-width: calc(100% - 32px);
        }

        .pmo-hero-visual-performance,
        .pmo-hero-visual-budget {
          height: 180px;
          max-height: 180px;
          width: 100%;
        }

        .pmo-hero-illustration-performance {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 520px;
        }

        .pmo-hero-illustration-budget {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 440px;
        }

        .pmo-health-track,
        .pmo-health-labels {
          width: 100%;
        }
      }
    `,
  ],
})
export class PmoFrontdoorComponent implements AfterViewChecked {
  @Output() readonly workspaceRequested = new EventEmitter<PmoGovernanceWorkspaceTarget | undefined>();
  @Output() readonly reportReviewRequested = new EventEmitter<void>();
  @Output() readonly decisionIntelligenceRequested = new EventEmitter<void>();

  selectedTab: PmoFrontdoorTab = 'overview';
  selectedPortfolioScope = 'all-portfolios';
  readonly tabs = pmoFrontdoorTabs;
  readonly metrics = pmoFrontdoorMetrics;
  readonly healthRows = pmoFrontdoorHealthRows;
  readonly digestSections = pmoFrontdoorDigestSections;
  readonly actions = pmoFrontdoorActions;
  readonly workItems = pmoFrontdoorWorkItems;
  readonly workFilters = pmoFrontdoorWorkFilters;
  readonly quickLinks = pmoFrontdoorQuickLinks;
  readonly portfolioScopeOptions: readonly ProjectOption[] = [{ id: 'all-portfolios', name: 'All Portfolios' }];
  readonly welcomeIconSrc = './assets/pane-top-icon.svg';
  readonly welcomeSubtitle = ["Here's what's happening across your portfolio today."];
  readonly budgetBars = Array.from({ length: 10 });
  private iconsHydrated = false;

  constructor(private readonly iconsService: PmConsoleIconService) {}

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  setTab(tabId: string): void {
    if (!isPmoFrontdoorTab(tabId) || tabId === this.selectedTab) return;
    this.selectedTab = tabId;
    this.iconsHydrated = false;
  }

  setPortfolioScope(scopeId: string): void {
    this.selectedPortfolioScope = scopeId;
    this.iconsHydrated = false;
  }

  selectAction(actionId: string): void {
    if (actionId === 'report-review') {
      this.reportReviewRequested.emit();
      return;
    }
    if (actionId === 'decision-intelligence') {
      this.decisionIntelligenceRequested.emit();
      return;
    }
    if (actionId) this.openWorkspace();
  }

  openQuickLink(link: PmoFrontdoorQuickLink): void {
    this.openWorkspace(link.target);
  }

  openWorkspace(target?: PmoGovernanceWorkspaceTarget): void {
    this.workspaceRequested.emit(target);
  }
}

function isPmoFrontdoorTab(tabId: string): tabId is PmoFrontdoorTab {
  return tabId === 'overview' || tabId === 'manage-work' || tabId === 'quicklinks';
}
