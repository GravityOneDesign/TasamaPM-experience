import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconService } from './pm-console-icon.service';
import { portfolioManagerSteps, Pm101Step } from './pm-console-pm101-steps';
import { iconName } from './pm-console-icon.utils';
import { PmConsoleMountOptions, ProjectOption } from './pm-console.types';
import { PortfolioManagerActionsComponent } from './portfolio-manager-actions.component';
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
import { PmConsoleProjectDropdownComponent } from './shared/pm-console-project-dropdown.component';

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

const portfolioOptions: readonly ProjectOption[] = [
  { id: 'portfolio', name: 'Portfolio Name' },
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
          { text: '72 portfolio items are currently' },
          { text: 'on track.', emphasis: true },
        ],
      },
      {
        parts: [
          { text: 'AED' },
          { text: '112.9M', emphasis: true },
          { text: 'total budget is under portfolio oversight' },
        ],
      },
      {
        parts: [
          { text: '63', emphasis: true },
          { text: 'non-financial resources are tracked' },
        ],
      },
    ],
  },
  {
    label: 'Portfolio Updates',
    items: [
      {
        parts: [
          { text: '14 delayed and 5 critical items', emphasis: true },
          { text: 'require follow-up.' },
        ],
      },
      {
        parts: [
          { text: 'Portfolio status has been' },
          { text: 'stable across the last 3 reports.', emphasis: true },
        ],
      },
      {
        parts: [
          { text: 'Report completion rate is' },
          { text: '74% this month.', emphasis: true },
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
    ctaLabel: step.comingSoon ? undefined : step.footerAction,
    badgeLabel: step.comingSoon ? 'Coming soon' : undefined,
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
    PmConsoleProjectDropdownComponent,
    PortfolioManagerActionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas pm101-operational-canvas portfolio-frontdoor-canvas">
      <div class="page-motion-host">
        <div class="content-grid pm101-operational-grid normal-pm-frontdoor-grid portfolio-frontdoor-grid">
          <div class="left-column">
            <section class="workspace-panel pm101-operational-workspace normal-pm-frontdoor-workspace portfolio-frontdoor-workspace">
              <div class="workspace-shell-head pm101-operational-shell-head pm101-frontdoor-assigned-shell-head normal-pm-frontdoor-shell-head portfolio-frontdoor-shell-head">
                <div class="workspace-shell-actions">
                  <app-pm-console-project-dropdown
                    label=""
                    leadingIcon="folder"
                    ariaLabel="Select portfolio"
                    [options]="portfolioOptions"
                    [value]="selectedPortfolio"
                    (valueChange)="setSelectedPortfolio($event)"
                  ></app-pm-console-project-dropdown>
                </div>
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
                      heroImageSrc="./assets/pm101-first-project-card-bg.png"
                      stageLabel="Portfolio overview"
                      statusLabel="On Track"
                      statusTone="green"
                      scheduleLabel="Portfolio Health"
                      [schedulePercent]="72"
                      [trendDots]="portfolioTrendDots"
                      nextPsrLabel="Next portfolio report due: 01 Jun 2026 · 3 days"
                      ctaLabel="Go to Portfolio Workspace"
                      [actions]="frontdoorActions"
                      [actionColumnCount]="4"
                      (projectOpen)="openAssignedProjectWorkspace()"
                      (actionSelected)="handleFrontdoorAction($event)"
                    ></app-pm-console-frontdoor-overview>
                  </div>
                } @else if (selectedTab === 'manage-work') {
                  <app-portfolio-manager-actions />
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
              [subtitleLines]="['Track portfolio health', 'and delivery progress.']"
              heroIconName="target"
              heroAssetSrc="./assets/pane-top-icon.svg"
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

    .portfolio-frontdoor-body {
      min-height: 0;
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
  `],
})
export class PortfolioManagerLandingComponent implements AfterViewChecked {
  @Output() readonly consoleStateChange = new EventEmitter<Partial<PmConsoleMountOptions>>();

  selectedTab: PortfolioLandingTab = 'overview';
  selectedPortfolio = 'portfolio';
  readonly landingTabs = portfolioLandingTabs;
  readonly portfolioOptions = portfolioOptions;
  readonly portfolioTrendDots = portfolioTrendDots;
  readonly portfolioDigestSections = portfolioDigestSections;
  readonly frontdoorActions = portfolioFrontdoorActions;
  readonly quickLinks = portfolioQuickLinks;
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

  setSelectedPortfolio(portfolioId: string): void {
    this.selectedPortfolio = portfolioId;
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
        portfolioWorkspaceTab: 'overview',
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
