import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { PmConsoleIconService } from './pm-console-icon.service';
import { PmConsoleNotificationsComponent } from './pm-console-notifications.component';
import { ProjectOption } from './pm-console.types';
import { PortfolioManagerActionDrawerPmComponent } from './portfolio-manager-action-drawer-pm.component';
import { PortfolioManagerActionDrawerService } from './portfolio-manager-action-drawer.service';
import { PortfolioManagerConsoleComponent } from './portfolio-manager-console.component';
import { PortfolioConsolePage, PortfolioManagerMountOptions, PortfolioWorkspaceView } from './portfolio-manager.types';
import { PmConsoleAgentDockComponent } from './shared/pm-console-agent-dock.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleSideNavComponent, type PmConsoleSideNavItem } from './shared/pm-console-side-nav.component';

interface PortfolioRailItem extends PmConsoleSideNavItem {
  page?: PortfolioConsolePage;
  view?: PortfolioWorkspaceView;
  home?: boolean;
}

@Component({
  selector: 'app-portfolio-manager-shell',
  standalone: true,
  imports: [
    PortfolioManagerActionDrawerPmComponent,
    PortfolioManagerConsoleComponent,
    PmConsoleAgentDockComponent,
    PmConsoleIconComponent,
    PmConsoleNotificationsComponent,
    PmConsoleSideNavComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modern-shell" [class.side-nav-expanded]="sideNavExpanded" [class.unassigned-mode]="frontDoorMode === 'unassigned'">
      <header class="app-header" [class.unassigned-header]="frontDoorMode === 'unassigned'" [class.workspaces-header]="usesConsoleHeader">
        <div class="brand-block">
          <button class="brand-logo-button" type="button" aria-label="Go to home" (click)="goHome()">
            <img class="brand-logo" src="./assets/client-logo-nav.svg" alt="Safe Security" />
          </button>

          @if (usesConsoleHeader) {
            <span class="brand-divider" aria-hidden="true"></span>
            <span class="brand-title">Portfolio Manager Console</span>
          }

          @if (frontDoorMode === 'unassigned') {
            <div class="project-switch no-project-switch" [class.is-ready]="pmoAssignmentReady" [attr.aria-label]="pmoAssignmentReady ? 'Project assigned' : 'No assigned projects'">
              <span class="project-switch-label">Status</span>
              <span class="no-project-switch-value">
                <span [pmConsoleIcon]="pmoAssignmentReady ? 'circle-check' : 'bell'" aria-hidden="true"></span>
                {{ pmoAssignmentReady ? 'Project assigned' : 'No assigned projects' }}
              </span>
            </div>
          }
        </div>

        <div class="header-actions">
          @if (usesConsoleHeader) {
            <label class="search-box global-console-search">
              <span pmConsoleIcon="search" aria-hidden="true"></span>
              <input type="search" aria-label="Search documents, people, or departments" placeholder="Search documents, people, or departments..." />
            </label>
          }
          <button class="round-button notification-button" [class.active]="notificationPanelOpen" type="button" aria-label="Notifications" [attr.aria-expanded]="notificationPanelOpen" (click)="toggleNotifications()">
            <span pmConsoleIcon="bell" aria-hidden="true"></span>
            <span class="notification-badge" aria-hidden="true"></span>
          </button>

          <div class="profile-chip-container">
            <div class="profile-chip" aria-label="Current user">
              <span class="avatar-xl">FQ<i></i></span>
              <span><strong>Fatima Qahtani</strong><small>Portfolio Manager</small></span>
            </div>
          </div>
        </div>
      </header>

      <app-pm-console-side-nav
        [primaryItems]="primaryRailItems"
        [utilityItems]="utilityRailItems"
        [activeItemId]="activeRailItemId"
        [expanded]="sideNavExpanded"
        (expandedChange)="setSideNavExpanded($event)"
        (itemSelected)="onRailItemClick($event)"
      />

      <app-portfolio-manager-console
        [projectOptions]="projects"
        [selectedProject]="selectedProject"
        [selectedPage]="selectedPage"
        [selectedView]="selectedView"
        [frontDoorMode]="frontDoorMode"
        [pmoAssignmentReady]="pmoAssignmentReady"
        [guidedTourActive]="guidedTourActive"
        [guidedTourExitMode]="guidedTourExitMode"
        [onboardingAssignmentFlow]="onboardingAssignmentFlow"
        [onboardingPm101Locked]="onboardingPm101Locked"
        [onboardingProjectSetup]="onboardingProjectSetup"
        [portfolioWorkspaceTab]="portfolioWorkspaceTab"
        (consoleStateChange)="applyContentState($event)"
      />

      <app-portfolio-manager-action-drawer-pm
        [item]="activePortfolioActionItem()"
        (close)="closePortfolioActionDrawer()"
      ></app-portfolio-manager-action-drawer-pm>
      <app-pm-console-notifications [open]="notificationPanelOpen" (closePanel)="closeNotifications()" />
      <app-pm-console-agent-dock />
    </div>
  `,
  styles: [
    `
      .profile-chip-container {
        display: inline-block;
        position: relative;
      }

      .profile-chip .avatar-xl {
        background: #e0f2fe;
        color: #0369a1;
      }
    `,
  ],
})
export class PortfolioManagerShellComponent implements OnInit, AfterViewChecked {
  private readonly portfolioActionDrawer = inject(PortfolioManagerActionDrawerService);

  @Input() initialState: PortfolioManagerMountOptions = {};
  readonly activePortfolioActionItem = this.portfolioActionDrawer.activeItem;

  readonly projects: ProjectOption[] = [
    { id: 'all', name: 'All projects' },
    { id: 'UAE Research Map', name: 'UAE Research Map' },
    { id: 'Global Anti-Scam Taskforce', name: 'Global Anti-Scam Taskforce' },
    { id: 'Counter Terrorism Operations', name: 'Counter Terrorism Operations' },
    { id: 'Vision 2030', name: 'Vision 2030' },
    { id: 'NEOM Integration', name: 'NEOM Integration' },
    { id: 'Smart City Alpha', name: 'Smart City Alpha' },
    { id: 'PMO Capability', name: 'PMO Capability' },
  ];

  readonly portfolioManagerRailItems: PortfolioRailItem[] = [
    { id: 'home', icon: 'house', label: 'Home', page: 'workspace', home: true },
    { id: 'register', icon: 'layout-grid', label: 'Portfolio Workspace', page: 'workspaces' },
  ];

  readonly bottomRailItems: PortfolioRailItem[] = [
    { id: 'help', icon: 'circle-help', label: 'Help' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  selectedProject = 'all';
  selectedPage: PortfolioConsolePage = 'workspace';
  selectedView: PortfolioWorkspaceView = 'pm101';
  frontDoorMode = 'assigned';
  notificationPanelOpen = false;
  pmoAssignmentReady = false;
  guidedTourActive = false;
  guidedTourExitMode: string | null = null;
  onboardingAssignmentFlow = false;
  onboardingPm101Locked = false;
  onboardingProjectSetup = false;
  portfolioWorkspaceTab = 'overview';
  sideNavExpanded = false;
  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly iconsService: PmConsoleIconService,
  ) { }

  get usesConsoleHeader(): boolean {
    return this.frontDoorMode !== 'unassigned' && ['workspace', 'workspaces', 'portfolio-workspace', 'framework', 'performance'].includes(this.selectedPage);
  }

  get primaryRailItems(): readonly PortfolioRailItem[] {
    return this.portfolioManagerRailItems.map((item) => ({
      ...item,
      disabled: this.isRailItemDisabled(item),
      disabledTitle: this.railItemDisabledTitle(item),
    }));
  }

  get utilityRailItems(): readonly PortfolioRailItem[] {
    return this.bottomRailItems;
  }

  get activeRailItemId(): string {
    const activeItemId = this.currentRailItemId;
    return this.isRailItemUnavailable(activeItemId) ? '' : activeItemId;
  }

  ngOnInit(): void {
    this.forgetSideNavExpandedPreference();
    this.selectedProject = this.initialState.projectId || 'all';
    this.selectedPage = this.initialState.selectedPage || 'workspace';
    this.selectedView = this.initialState.selectedView || 'pm101';
    this.frontDoorMode = this.initialState.frontDoorMode || 'assigned';
    this.guidedTourActive = Boolean(this.initialState.guidedTourActive);
    this.guidedTourExitMode = this.initialState.guidedTourExitMode ?? null;
    this.pmoAssignmentReady = Boolean(this.initialState.pmoAssignmentReady);
    this.onboardingAssignmentFlow = Boolean(this.initialState.onboardingAssignmentFlow);
    this.onboardingPm101Locked = Boolean(this.initialState.onboardingPm101Locked);
    this.onboardingProjectSetup = Boolean(this.initialState.onboardingProjectSetup);
    this.portfolioWorkspaceTab = this.initialState.portfolioWorkspaceTab || 'overview';
  }

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  goHome(): void {
    this.selectedProject = 'all';
    this.selectedPage = 'workspace';
    this.selectedView = 'pm101';
    this.notificationPanelOpen = false;
    this.markShellChanged();
  }

  onRailItemClick(item: PmConsoleSideNavItem): void {
    const railItem = [...this.primaryRailItems, ...this.utilityRailItems].find((candidate) => candidate.id === item.id);
    if (!railItem) return;

    if (railItem.home) {
      this.goHome();
      return;
    }
    if (railItem.view) {
      this.setWorkspaceView(railItem.view);
      return;
    }
    if (railItem.page) {
      this.setPage(railItem.page);
    }
  }

  setPage(page: PortfolioConsolePage): void {
    if (this.frontDoorMode === 'unassigned' && page !== 'workspace') return;
    this.selectedPage = page === 'workspaces' ? 'portfolio-workspace' : page;
    this.markShellChanged();
  }

  setWorkspaceView(view: PortfolioWorkspaceView): void {
    if (this.frontDoorMode === 'unassigned' || this.onboardingPm101Locked) return;
    this.selectedPage = 'workspace';
    this.selectedView = view;
    this.notificationPanelOpen = false;
    this.markShellChanged();
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

  closePortfolioActionDrawer(): void {
    this.portfolioActionDrawer.close();
  }

  applyContentState(state: Partial<PortfolioManagerMountOptions>): void {
    this.selectedProject = state.projectId || this.selectedProject;
    const targetPage = state.selectedPage || this.selectedPage;
    this.selectedPage = targetPage === 'workspaces' ? 'portfolio-workspace' : targetPage;
    this.selectedView = state.selectedView || this.selectedView;
    this.frontDoorMode = state.frontDoorMode || this.frontDoorMode;
    if ('pmoAssignmentReady' in state) this.pmoAssignmentReady = Boolean(state.pmoAssignmentReady);
    if ('guidedTourActive' in state) this.guidedTourActive = Boolean(state.guidedTourActive);
    if ('guidedTourExitMode' in state) this.guidedTourExitMode = state.guidedTourExitMode ?? null;
    if ('onboardingAssignmentFlow' in state) this.onboardingAssignmentFlow = Boolean(state.onboardingAssignmentFlow);
    if ('onboardingPm101Locked' in state) this.onboardingPm101Locked = Boolean(state.onboardingPm101Locked);
    if ('onboardingProjectSetup' in state) this.onboardingProjectSetup = Boolean(state.onboardingProjectSetup);
    if ('portfolioWorkspaceTab' in state) this.portfolioWorkspaceTab = state.portfolioWorkspaceTab || 'overview';
    this.markShellChanged();
  }

  private markShellChanged(): void {
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  private forgetSideNavExpandedPreference(): void {
    try {
      window.localStorage.removeItem('tasama.sideNavExpanded');
    } catch {
      return;
    }
  }

  private isRailItemDisabled(item: PortfolioRailItem): boolean {
    if (item.disabled) return true;
    if (!item.page && !item.view) return false;
    if (item.home) return false;
    return this.frontDoorMode === 'unassigned' || this.onboardingPm101Locked;
  }

  private railItemDisabledTitle(item: PortfolioRailItem): string | null {
    if (item.disabled) return item.disabledTitle ?? null;
    if (!this.isRailItemDisabled(item)) return null;
    return this.onboardingPm101Locked ? 'Available after PM 101 onboarding' : 'Available after PMO assigns a project';
  }

  private get currentRailItemId(): string {
    if (this.selectedPage === 'workspaces' || this.selectedPage === 'portfolio-workspace') return 'register';
    if (this.selectedPage === 'workspace') return 'home';
    return '';
  }

  private isRailItemUnavailable(itemId: string): boolean {
    const railItem = [...this.primaryRailItems, ...this.utilityRailItems].find((candidate) => candidate.id === itemId);
    return railItem ? this.isRailItemDisabled(railItem) : false;
  }
}
