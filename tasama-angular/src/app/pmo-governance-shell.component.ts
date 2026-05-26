import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { PmConsoleIconService } from './pm-console-icon.service';
import { PmConsoleNotificationsComponent } from './pm-console-notifications.component';
import { PortfolioManagerActionDrawerComponent } from './portfolio-manager-action-drawer.component';
import { PortfolioManagerActionDrawerService } from './portfolio-manager-action-drawer.service';
import { PmoGovernanceForumDetailDrawerComponent } from './pmo-governance-forum-detail-drawer.component';
import { PmoGovernanceWorkspaceComponent } from './pmo-governance-workspace.component';
import {
  pmoGovernanceDefaultWorkspaceTarget,
  pmoGovernanceForumRows,
  type PmoGovernanceForumRow,
  type PmoGovernanceWorkspaceTarget,
} from './pmo-governance-workspace.data';
import { PmoDecisionIntelligenceComponent } from './pmo-decision-intelligence.component';
import { PmoFrontdoorComponent } from './pmo-frontdoor.component';
import { PmoReportReviewDrawerComponent } from './pmo-report-review-drawer.component';
import { PmoReportReviewProgressComponent } from './pmo-report-review-progress.component';
import type { PmoReportReviewCard } from './pmo-report-review-progress.data';
import { PmConsoleAgentDockComponent } from './shared/pm-console-agent-dock.component';
import { PmConsoleSideNavComponent, type PmConsoleSideNavItem } from './shared/pm-console-side-nav.component';
import { PmConsoleTopBarComponent } from './shared/pm-console-top-bar.component';

@Component({
  selector: 'app-pmo-governance-shell',
  standalone: true,
  imports: [
    PmoGovernanceForumDetailDrawerComponent,
    PmoGovernanceWorkspaceComponent,
    PmoDecisionIntelligenceComponent,
    PmoFrontdoorComponent,
    PmoReportReviewDrawerComponent,
    PmoReportReviewProgressComponent,
    PmConsoleAgentDockComponent,
    PmConsoleNotificationsComponent,
    PmConsoleSideNavComponent,
    PmConsoleTopBarComponent,
    PortfolioManagerActionDrawerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modern-shell pmo-governance-shell" [class.side-nav-expanded]="sideNavExpanded">
      <app-pm-console-top-bar
        consoleTitle="Portfolio Management Office"
        profileName="Muna Hassan"
        profileRole="PMO Lead"
        profileInitials="MH"
        profileDisplay="avatar"
        [notificationPanelOpen]="notificationPanelOpen"
        (homeSelected)="goHome()"
        (notificationsToggled)="toggleNotifications()"
      />

      <app-pm-console-side-nav
        [primaryItems]="primaryRailItems"
        [utilityItems]="utilityRailItems"
        [activeItemId]="activeRailItemId"
        [expanded]="sideNavExpanded"
        (expandedChange)="setSideNavExpanded($event)"
        (itemSelected)="onRailItemClick($event)"
      />

      @if (activeSurface === 'frontdoor') {
        <app-pmo-frontdoor
          (workspaceRequested)="openWorkspace($event)"
          (reportReviewRequested)="openReportReview()"
          (decisionIntelligenceRequested)="openDecisionIntelligence()"
        />
      } @else if (activeSurface === 'governance') {
        <app-pmo-governance-workspace
          [forums]="forums"
          [initialTarget]="workspaceTarget"
          (backSelected)="goHome()"
          (forumDetailSelected)="openForumDetail($event)"
        />
      } @else if (activeSurface === 'decision-intelligence') {
        <app-pmo-decision-intelligence (backSelected)="goHome()" />
      } @else {
        <app-pmo-report-review-progress
          (backSelected)="goHome()"
          (reportDrawerRequested)="openReportDrawer($event)"
        />
      }
      <app-pm-console-notifications [open]="notificationPanelOpen" (closePanel)="closeNotifications()" />
      <app-pm-console-agent-dock />
      <app-portfolio-manager-action-drawer
        [item]="activePortfolioActionItem()"
        (close)="closePortfolioActionDrawer()"
      ></app-portfolio-manager-action-drawer>

      @if (selectedForum; as forum) {
        <app-pmo-governance-forum-detail-drawer [forum]="forum" (forumUpdated)="updateForum($event)" (closeSelected)="closeForumDetail()" />
      }

      @if (selectedReport; as report) {
        <app-pmo-report-review-drawer [report]="report" (close)="closeReportDrawer()" />
      }
    </div>
  `,
})
export class PmoGovernanceShellComponent implements AfterViewChecked {
  private readonly portfolioActionDrawer = inject(PortfolioManagerActionDrawerService);

  readonly activePortfolioActionItem = this.portfolioActionDrawer.activeItem;

  readonly primaryRailItems: readonly PmConsoleSideNavItem[] = [
    { id: 'home', icon: 'chart-column', label: 'Home' },
    { id: 'governance', icon: 'layout-grid', label: 'My Workspace' },
  ];

  readonly utilityRailItems: readonly PmConsoleSideNavItem[] = [
    { id: 'help', icon: 'circle-help', label: 'Help' },
    { id: 'sign-out', icon: 'log-out', label: 'Sign out' },
  ];

  activeSurface: 'frontdoor' | 'governance' | 'report-review' | 'decision-intelligence' = 'frontdoor';
  forums: readonly PmoGovernanceForumRow[] = pmoGovernanceForumRows;
  workspaceTarget: PmoGovernanceWorkspaceTarget = pmoGovernanceDefaultWorkspaceTarget;
  notificationPanelOpen = false;
  selectedForum: PmoGovernanceForumRow | null = null;
  selectedReport: PmoReportReviewCard | null = null;
  sideNavExpanded = false;
  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly iconsService: PmConsoleIconService,
  ) {}

  get activeRailItemId(): string {
    return this.activeSurface === 'governance' ? 'governance' : 'home';
  }

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  goHome(): void {
    this.activeSurface = 'frontdoor';
    this.notificationPanelOpen = false;
    this.selectedForum = null;
    this.selectedReport = null;
    this.markShellChanged();
  }

  onRailItemClick(item: PmConsoleSideNavItem): void {
    if (item.disabled) return;
    if (item.id === 'home') {
      this.goHome();
      return;
    }
    if (item.id === 'governance') {
      this.openWorkspace();
      return;
    }
  }

  openWorkspace(target: PmoGovernanceWorkspaceTarget | undefined = pmoGovernanceDefaultWorkspaceTarget): void {
    this.workspaceTarget = target ?? pmoGovernanceDefaultWorkspaceTarget;
    if (this.activeSurface !== 'governance') {
      this.activeSurface = 'governance';
      this.selectedForum = null;
      this.selectedReport = null;
      this.notificationPanelOpen = false;
      this.markShellChanged();
      return;
    }
    this.markShellChanged();
  }

  openReportReview(): void {
    if (this.activeSurface !== 'report-review') {
      this.activeSurface = 'report-review';
      this.selectedForum = null;
      this.selectedReport = null;
      this.notificationPanelOpen = false;
      this.markShellChanged();
    }
  }

  openDecisionIntelligence(): void {
    if (this.activeSurface !== 'decision-intelligence') {
      this.activeSurface = 'decision-intelligence';
      this.selectedForum = null;
      this.selectedReport = null;
      this.notificationPanelOpen = false;
      this.resetViewportScroll();
      this.markShellChanged();
    }
  }

  setSideNavExpanded(expanded: boolean): void {
    if (this.sideNavExpanded === expanded) return;
    this.sideNavExpanded = expanded;
    this.markShellChanged();
  }

  toggleNotifications(): void {
    this.notificationPanelOpen = !this.notificationPanelOpen;
    this.markShellChanged();
  }

  closeNotifications(): void {
    if (!this.notificationPanelOpen) return;
    this.notificationPanelOpen = false;
    this.markShellChanged();
  }

  openForumDetail(forum: PmoGovernanceForumRow): void {
    this.selectedForum = this.forums.find((item) => item.id === forum.id) ?? forum;
    this.selectedReport = null;
    this.notificationPanelOpen = false;
    this.markShellChanged();
  }

  updateForum(forum: PmoGovernanceForumRow): void {
    this.forums = this.forums.map((item) => (item.id === forum.id ? forum : item));
    this.selectedForum = forum;
    this.markShellChanged();
  }

  closeForumDetail(): void {
    if (!this.selectedForum) return;
    this.selectedForum = null;
    this.markShellChanged();
  }

  openReportDrawer(report: PmoReportReviewCard): void {
    this.selectedReport = report;
    this.selectedForum = null;
    this.notificationPanelOpen = false;
    this.markShellChanged();
  }

  closeReportDrawer(): void {
    if (!this.selectedReport) return;
    this.selectedReport = null;
    this.markShellChanged();
  }

  closePortfolioActionDrawer(): void {
    this.portfolioActionDrawer.close();
    this.markShellChanged();
  }

  private markShellChanged(): void {
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  private resetViewportScroll(): void {
    window.setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
  }
}
