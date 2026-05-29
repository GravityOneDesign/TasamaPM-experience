import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconService } from './pm-console-icon.service';
import { portfolioManagerSteps, Pm101Step } from './portfolio-manager-pm101-steps';
import { iconName } from './portfolio-manager-icon.utils';
import { PortfolioManagerMountOptions } from './portfolio-manager.types';
import { PortfolioManagerActionsPmComponent } from './portfolio-manager-actions-pm.component';
import {
  PmConsoleDigestPanelComponent,
  type PmConsoleDigestSection,
} from './shared/pm-console-digest-panel.component';
import {
  PmConsoleFrontdoorOverviewComponent,
  type PmConsoleFrontdoorAction,
  type PmConsoleFrontdoorTrendDot,
} from './shared/pm-console-frontdoor-overview.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleModeTabsComponent, type PmConsoleModeTabItem } from './shared/pm-console-mode-tabs.component';

type PortfolioLandingTab = 'overview' | 'manage-work' | 'quicklinks';
type PortfolioQuickLinkId = 'framework' | 'workspace' | 'registers' | 'reports' | 'performance' | 'actions';

interface PortfolioQuickLink {
  id: PortfolioQuickLinkId;
  title: string;
  description: string;
  icon: string;
}

const portfolioLandingTabs: readonly PmConsoleModeTabItem[] = [
  { id: 'overview', label: 'Overview', icon: 'square-chart-gantt', widthPx: 144 },
  { id: 'manage-work', label: 'Manage My Work', icon: 'network', widthPx: 190 },
  { id: 'quicklinks', label: 'Quick links', icon: 'folder-symlink', widthPx: 158 },
];

const portfolioTrendDots: readonly PmConsoleFrontdoorTrendDot[] = [
  { tone: 'green', label: 'On track' },
  { tone: 'green', label: 'On track' },
  { tone: 'amber', label: 'Delayed' },
  { tone: 'green', label: 'On track' },
  { tone: 'red', label: 'Critical' },
];

const portfolioDigestSections: readonly PmConsoleDigestSection[] = [
  {
    label: 'Birds Eye View',
    items: [
      {
        parts: [
          { text: 'Your portfolio is on track. ' },
          { text: '72 of 91', emphasis: true },
          { text: ' items are running to schedule, and your overall status has been stable across the last ' },
          { text: '3 reports.', emphasis: true },
        ],
      },
    ],
  },
  {
    label: 'Portfolio Updates',
    items: [
      {
        parts: [
          { text: '14 items', emphasis: true },
          { text: ' are delayed and ' },
          { text: '5', emphasis: true },
          { text: ' are critical. Visit your portfolio workspace to see which programs and projects need attention.' },
        ],
      },
      {
        parts: [
          { text: 'Reporting completion is down to ' },
          { text: '74%', emphasis: true },
          { text: ' this month from ' },
          { text: '89%', emphasis: true },
          { text: ' last month. Follow up with  managers who have not yet reported.' },
        ],
      },
      {
        parts: [
          { text: 'You have not submitted a portfolio report this month. Head to ' },
          { text: 'Report Progress', emphasis: true },
          { text: ' to submit your latest status update.' },
        ],
      },
    ],
  },
];

const portfolioFrontdoorActions: readonly PmConsoleFrontdoorAction[] = portfolioManagerSteps.map((step) => portfolioStepToAction(step));

const portfolioQuickLinks: readonly PortfolioQuickLink[] = [
  {
    id: 'framework',
    title: 'Framework & Configuration',
    description: 'Set governance controls, structures, users, workflows, and portfolio standards.',
    icon: 'settings',
  },
  {
    id: 'workspace',
    title: 'Portfolio workspace',
    description: 'Open the portfolio workspace overview and continue monitoring delivery health.',
    icon: 'layout-grid',
  },
  {
    id: 'registers',
    title: 'Programs & Projects',
    description: 'View portfolio programs and projects with their current delivery status.',
    icon: 'folder-tree',
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Create, review, and track portfolio status reports in one place.',
    icon: 'file-text',
  },
  {
    id: 'performance',
    title: 'Portfolio performance',
    description: 'Track portfolio-level delivery, health, and financial performance insights.',
    icon: 'activity',
  },
  {
    id: 'actions',
    title: 'Action review',
    description: 'Review pending approvals, follow-ups, and delivery actions for the portfolio.',
    icon: 'list-checks',
  },
];

function portfolioStepToAction(step: Pm101Step): PmConsoleFrontdoorAction {
  return {
    id: step.footerActionId ?? step.title,
    title: step.title,
    description: step.body,
    icon: iconName(step.icon),
    badgeLabel: undefined,
    disabled: step.comingSoon,
    decor: portfolioActionDecor(step.decor),
  };
}

function portfolioActionDecor(decor: string): PmConsoleFrontdoorAction['decor'] {
  if (decor === 'waves' || decor === 'loops' || decor === 'hex' || decor === 'plus' || decor === 'burst') {
    return decor;
  }
  if (decor === 'rings') return 'loops';
  return 'waves';
}

@Component({
  selector: 'app-portfolio-manager-landing',
  standalone: true,
  imports: [
    CommonModule,
    PmConsoleDigestPanelComponent,
    PmConsoleFrontdoorOverviewComponent,
    PmConsoleIconComponent,
    PmConsoleModeTabsComponent,
    PortfolioManagerActionsPmComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas pm101-operational-canvas portfolio-frontdoor-canvas">
      <div class="page-motion-host">
        <div class="content-grid pm101-operational-grid normal-pm-frontdoor-grid portfolio-frontdoor-grid">
          <div class="left-column">
            <section class="workspace-panel pm101-operational-workspace normal-pm-frontdoor-workspace portfolio-frontdoor-workspace">
              <div class="workspace-shell-head pm101-operational-shell-head pm101-frontdoor-assigned-shell-head normal-pm-frontdoor-shell-head portfolio-frontdoor-shell-head">
                <div class="onboarding-operational-tabs" data-tour-target="workspace-tabs">
                  <app-pm-console-mode-tabs
                    ariaLabel="Portfolio manager workspace view"
                    [tabs]="landingTabs"
                    [activeId]="selectedTab"
                    (tabSelected)="setTab($event)"
                  ></app-pm-console-mode-tabs>
                </div>
              </div>

              <div class="workspace-body normal-pm-frontdoor-body portfolio-frontdoor-body">
                @if (selectedTab === 'overview') {
                  <div class="pm101-view pm101-operational-view normal-pm-frontdoor-overview" data-work-view="pm101" data-tour-target="frontdoor-overview">
                    <app-pm-console-frontdoor-overview
                      projectId="portfolio"
                      projectName="Portfolio Name"
                      projectIcon="folder"
                      heroImageSrc="./assets/Portfolio manager card.png"
                      stageLabel="Portfolio overview"
                      statusLabel="On Track"
                      statusTone="green"
                      scheduleLabel="Portfolio Health"
                      [schedulePercent]="72"
                      [trendDots]="portfolioTrendDots"
                      nextPsrLabel="Next portfolio report due: 01 Jun 2026 · 3 days"
                      ctaLabel="Go to Portfolio Workspace"
                      [actions]="frontdoorActions"
                      [actionColumnCount]="5"
                      [hideSchedule]="true"
                      [journeyDescriptorTitle]="journeyDescriptorTitleText"
                      [journeyDescriptor]="journeyDescriptorText"
                      (projectOpen)="openAssignedProjectWorkspace()"
                      (actionSelected)="handleFrontdoorAction($event)"
                    ></app-pm-console-frontdoor-overview>
                  </div>
                } @else if (selectedTab === 'manage-work') {
                  <app-portfolio-manager-actions-pm />
                } @else {
                  <div class="quicklinks-view portfolio-quicklinks-view" data-work-view="quicklinks">
                    <section class="workspace-quick-links-view" aria-label="Portfolio Name Quick links">
                      <h2>Portfolio Name</h2>
                      <div class="selected-project-quick-link-grid">
                        @for (link of quickLinks; track link.id) {
                          <article class="selected-project-quick-link-card" [attr.data-quick-link-id]="link.id">
                            <button class="selected-project-quick-link-main" type="button" [attr.aria-label]="link.title + ' for Portfolio Name'" (click)="openQuickLink(link.id)">
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

          <div class="right-column normal-pm-digest-column">
            <app-pm-console-digest-panel
              data-tour-target="frontdoor-digest"
              title="Welcome!"
              [subtitleLines]="welcomeSubtitle"
              heroIconName="target"
              [heroAssetSrc]="welcomeIconSrc"
              digestTitle="Daily Digest"
              digestIconName="wand-sparkles"
              [sections]="portfolioDigestSections"
            ></app-pm-console-digest-panel>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .portfolio-frontdoor-grid {
      align-content: stretch;
      align-items: stretch;
    }

    .portfolio-frontdoor-workspace {
      min-width: 0;
    }

    .portfolio-frontdoor-workspace .portfolio-frontdoor-body {
      min-height: 0;
      padding: 16px 16px 24px;
    }

    .portfolio-quicklinks-view {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: auto;
    }

    .portfolio-quicklinks-view .workspace-quick-links-view {
      padding-top: 0;
    }

    .portfolio-quicklinks-view .selected-project-quick-link-grid {
      align-items: stretch;
      grid-auto-rows: minmax(166px, 1fr);
    }

    .portfolio-quicklinks-view .selected-project-quick-link-card,
    .portfolio-quicklinks-view .selected-project-quick-link-main {
      height: 100%;
      min-height: 0;
    }

    app-pm-console-digest-panel ::ng-deep .digest-panel-section-label {
      font-size: 14px;
      font-weight: 500;
    }

    app-pm-console-digest-panel ::ng-deep .digest-panel-hero {
      align-items: start;
    }

    app-pm-console-digest-panel ::ng-deep .digest-panel-hero-copy {
      gap: 4px;
    }

    app-pm-console-digest-panel ::ng-deep .digest-panel-title span:last-child {
      font-size: 14px;
      line-height: 20px;
    }

    app-pm-console-digest-panel ::ng-deep .digest-panel-title .icon {
      height: 18px;
      width: 18px;
    }

    app-pm-console-digest-panel ::ng-deep .digest-panel-item {
      font-size: 13px;
      line-height: 19px;
      padding: 10px 12px;
    }

    app-pm-console-digest-panel ::ng-deep .digest-panel-content {
      margin-top: 20px;
      gap: 32px;
    }

    app-pm-console-digest-panel ::ng-deep .digest-panel-section {
      gap: 14px;
    }

    app-pm-console-digest-panel ::ng-deep .digest-panel-list {
      gap: 12px;
    }
  `],
})
export class PortfolioManagerLandingComponent implements AfterViewChecked {
  @Output() readonly consoleStateChange = new EventEmitter<Partial<PortfolioManagerMountOptions>>();

  selectedTab: PortfolioLandingTab = 'overview';
  readonly landingTabs = portfolioLandingTabs;
  readonly portfolioTrendDots = portfolioTrendDots;
  readonly portfolioDigestSections = portfolioDigestSections;
  readonly frontdoorActions = portfolioFrontdoorActions;
  readonly quickLinks = portfolioQuickLinks;
  readonly journeyDescriptorTitleText = "Run your portfolio, end to end";
  readonly journeyDescriptorText = "Navigate every key area of your portfolio, all in one place.";
  readonly welcomeSubtitle = [
    "Here's what's happening across your portfolio today."
  ];
  readonly welcomeIconSrc = "./assets/client-logo-mark.svg";
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

  setTab(tabId: string): void {
    if (tabId !== 'overview' && tabId !== 'manage-work' && tabId !== 'quicklinks') return;
    this.selectedTab = tabId;
    this.refreshIcons();
  }

  openAssignedProjectWorkspace(): void {
    this.consoleStateChange.emit({
      selectedPage: 'portfolio-workspace',
      portfolioWorkspaceTab: 'overview',
    });
  }

  handleFrontdoorAction(actionId: string): void {
    if (actionId === 'framework') {
      this.consoleStateChange.emit({
        selectedPage: 'framework',
      });
      return;
    }
    if (actionId === 'reports') {
      this.consoleStateChange.emit({
        selectedPage: 'portfolio-workspace',
        portfolioWorkspaceTab: 'reports',
      });
      return;
    }
    if (actionId === 'registers') {
      this.consoleStateChange.emit({
        selectedPage: 'portfolio-workspace',
        portfolioWorkspaceTab: actionId,
      });
    }
  }

  openQuickLink(linkId: PortfolioQuickLinkId): void {
    if (linkId === 'actions') {
      this.selectedTab = 'manage-work';
      this.refreshIcons();
      return;
    }
    if (linkId === 'framework') {
      this.consoleStateChange.emit({ selectedPage: 'framework' });
      return;
    }
    if (linkId === 'performance') {
      this.consoleStateChange.emit({ selectedPage: 'performance' });
      return;
    }
    if (linkId === 'registers' || linkId === 'reports') {
      this.consoleStateChange.emit({
        selectedPage: 'portfolio-workspace',
        portfolioWorkspaceTab: linkId,
      });
      return;
    }
    this.openAssignedProjectWorkspace();
  }

  private refreshIcons(): void {
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }
}
