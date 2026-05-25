import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { PmConsoleContentComponent } from './pm-console-content.component';
import { PortfolioManagerActionDrawerComponent } from './portfolio-manager-action-drawer.component';
import { PortfolioManagerActionDrawerService } from './portfolio-manager-action-drawer.service';
import { PortfolioManagerConsoleComponent } from './portfolio-manager-console.component';
import { PmConsoleIconService } from './pm-console-icon.service';
import { ConsolePage, ConsoleUser, PmConsoleMountOptions, ProjectOption } from './pm-console.types';
import { PmConsoleNotificationsComponent } from './pm-console-notifications.component';
import { PmConsoleAgentDockComponent } from './shared/pm-console-agent-dock.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleSideNavComponent, type PmConsoleSideNavItem } from './shared/pm-console-side-nav.component';
import { PmConsoleTopBarComponent } from './shared/pm-console-top-bar.component';

interface RailItem extends PmConsoleSideNavItem {
  page?: ConsolePage;
  view?: WorkspaceView;
  home?: boolean;
}

type WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages' | 'quicklinks';
const ONBOARDING_PM101_PROJECT_ID = 'all';
const ONBOARDING_ASSIGNED_PROJECT_ID = 'UAE Research Map';

@Component({
  selector: 'app-pm-console-shell',
  standalone: true,
  imports: [PmConsoleAgentDockComponent, PmConsoleContentComponent, PortfolioManagerActionDrawerComponent, PortfolioManagerConsoleComponent, PmConsoleIconComponent, PmConsoleNotificationsComponent, PmConsoleSideNavComponent, PmConsoleTopBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modern-shell" [class.side-nav-expanded]="sideNavExpanded" [class.playground-mode]="selectedPage === 'playground'" [class.wbs-mode]="selectedPage === 'wbs'" [class.project-plan-mode]="selectedPage === 'project-plan'" [class.unassigned-mode]="frontDoorMode === 'unassigned'">
      @if (currentUser === 'muna') {
        <app-pm-console-top-bar
          [showConsoleHeader]="usesConsoleHeader"
          [unassigned]="frontDoorMode === 'unassigned'"
          [pmoAssignmentReady]="pmoAssignmentReady"
          [notificationPanelOpen]="notificationPanelOpen"
          (homeSelected)="goHome()"
          (notificationsToggled)="toggleNotifications()"
        />
      } @else {
        <header class="app-header" [class.unassigned-header]="frontDoorMode === 'unassigned'" [class.workspaces-header]="usesConsoleHeader">
        <div class="brand-block">
          <button
            class="brand-logo-button"
            type="button"
            aria-label="Go to home"
            (click)="goHome()"
          >
            <img class="brand-logo" [src]="currentUser === 'fatima' ? './assets/client-logo-nav.svg' : './assets/tasama-small.svg'" [alt]="currentUser === 'fatima' ? 'Safe Security' : 'Tasama'" />
          </button>

          @if (usesConsoleHeader) {
            <span class="brand-divider" aria-hidden="true"></span>
            <span class="brand-title">{{ currentUser === 'fatima' ? 'Portfolio Manager Console' : 'PM Console' }}</span>
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

          <div class="profile-chip-container" style="position: relative; display: inline-block;">
            <div class="profile-chip" aria-label="Current user">
              <span class="avatar-xl" style="background: #e0f2fe; color: #0369a1;">FQ<i></i></span>
              <span><strong>Fatima Qahtani</strong><small>Portfolio Manager</small></span>
            </div>
          </div>
        </div>
        </header>
      }

      <app-pm-console-side-nav
        [primaryItems]="primaryRailItems"
        [utilityItems]="utilityRailItems"
        [activeItemId]="activeRailItemId"
        [expanded]="sideNavExpanded"
        (expandedChange)="setSideNavExpanded($event)"
        (itemSelected)="onRailItemClick($event)"
      />

      @if (currentUser === 'muna') {
        <app-pm-console-content
          [projectOptions]="projects"
          [selectedProject]="selectedProject"
          [selectedPage]="$any(selectedPage)"
          [selectedView]="$any(selectedView)"
          [frontDoorMode]="frontDoorMode"
          [pmoAssignmentReady]="pmoAssignmentReady"
          [guidedTourActive]="guidedTourActive"
          [guidedTourExitMode]="guidedTourExitMode"
          [onboardingAssignmentFlow]="onboardingAssignmentFlow"
          [onboardingPm101Locked]="onboardingPm101Locked"
          [onboardingProjectSetup]="onboardingProjectSetup"
          (consoleStateChange)="applyContentState($event)"
        />
      } @else {
        <app-portfolio-manager-console
          [projectOptions]="projects"
          [selectedProject]="selectedProject"
          [selectedPage]="selectedPage"
          [selectedView]="$any(selectedView)"
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
      }
      @if (currentUser === 'fatima') {
        <app-portfolio-manager-action-drawer
          [item]="activePortfolioActionItem()"
          (close)="closePortfolioActionDrawer()"
        ></app-portfolio-manager-action-drawer>
      }
      <app-pm-console-notifications [open]="notificationPanelOpen" (closePanel)="closeNotifications()" />
      <app-pm-console-agent-dock />
    </div>
  `,
})
export class PmConsoleShellComponent implements OnInit, AfterViewChecked {
  private readonly portfolioActionDrawer = inject(PortfolioManagerActionDrawerService);

  @Input() initialState: PmConsoleMountOptions = {};
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

  readonly projectManagerRailItems: RailItem[] = [
    { id: 'home', icon: 'house', label: 'Home', page: 'workspace', home: true },
    { id: 'register', icon: 'layout-grid', label: 'My Workspace', page: 'workspaces' },
    {
      id: 'dashboards',
      icon: 'chart-column',
      label: 'Dashboards',
      page: 'workspace',
      view: 'board',
      disabled: true,
      disabledTitle: 'Dashboards are not available yet',
    },
  ];

  readonly portfolioManagerRailItems: RailItem[] = [
    { id: 'home', icon: 'house', label: 'Home', page: 'workspace', home: true },
    { id: 'register', icon: 'layout-grid', label: 'Register', page: 'workspaces' },
  ];

  readonly bottomRailItems: RailItem[] = [
    { id: 'help', icon: 'circle-help', label: 'Help' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  selectedProject = 'all';
  selectedPage: ConsolePage = 'workspace';
  selectedView: WorkspaceView = 'calendar';
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
  currentUser: ConsoleUser = 'muna';
  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly iconsService: PmConsoleIconService,
  ) {}

  get isProjectScopedPage(): boolean {
    return this.selectedPage === 'playground' || this.selectedPage === 'wbs' || this.selectedPage === 'project-plan';
  }

  get usesConsoleHeader(): boolean {
    if (this.currentUser === 'muna') return this.frontDoorMode !== 'unassigned';
    return this.frontDoorMode !== 'unassigned' && (this.selectedPage === 'workspace' || this.selectedPage === 'workspaces' || this.selectedPage === 'portfolio-workspace' || this.selectedPage === 'framework' || this.selectedPage === 'performance');
  }

  get primaryRailItems(): readonly RailItem[] {
    const baseItems = this.currentUser === 'fatima' ? [...this.portfolioManagerRailItems] : [...this.projectManagerRailItems];
    return baseItems.map((item) => ({
      ...item,
      label: item.id === 'register' && this.currentUser === 'fatima' ? 'Portfolio Workspace' : item.label,
      disabled: this.isRailItemDisabled(item),
      disabledTitle: this.railItemDisabledTitle(item),
    }));
  }

  get utilityRailItems(): readonly RailItem[] {
    return this.bottomRailItems;
  }

  get activeRailItemId(): string {
    const activeItemId = this.currentRailItemId;
    return this.isRailItemUnavailable(activeItemId) ? '' : activeItemId;
  }

  ngOnInit(): void {
    this.forgetSideNavExpandedPreference();
    this.selectedProject = this.initialState.projectId || 'all';
    this.selectedPage = (this.initialState.selectedPage as ConsolePage) || 'workspace';
    this.selectedView = (this.initialState.selectedView as WorkspaceView) || 'calendar';
    this.frontDoorMode = this.initialState.frontDoorMode || 'assigned';
    this.guidedTourActive = Boolean(this.initialState.guidedTourActive);
    this.guidedTourExitMode = this.initialState.guidedTourExitMode ?? null;
    this.pmoAssignmentReady = Boolean(this.initialState.pmoAssignmentReady);
    this.currentUser = this.initialState.currentUser || 'muna';
    this.onboardingAssignmentFlow = Boolean(this.initialState.onboardingAssignmentFlow);
    this.onboardingPm101Locked = Boolean(this.initialState.onboardingPm101Locked);
    this.onboardingProjectSetup = Boolean(this.initialState.onboardingProjectSetup);
    this.portfolioWorkspaceTab = this.initialState.portfolioWorkspaceTab || 'overview';
    if (this.onboardingPm101Locked) {
      this.selectedProject = ONBOARDING_PM101_PROJECT_ID;
      this.selectedView = 'pm101';
    }
  }

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  setPage(page: ConsolePage): void {
    if (this.frontDoorMode === 'unassigned' && page !== 'workspace') return;
    let targetPage = page;
    if (this.currentUser === 'fatima' && targetPage === 'workspaces') {
      targetPage = 'portfolio-workspace';
    }
    if (this.onboardingAssignmentFlow && this.pmoAssignmentReady && !this.onboardingProjectSetup && targetPage === 'workspaces') {
      this.onboardingProjectSetup = true;
      this.onboardingPm101Locked = false;
      this.selectedProject = ONBOARDING_ASSIGNED_PROJECT_ID;
      this.selectedView = 'pm101';
    }
    this.selectedPage = targetPage;
    if (this.isProjectScopedPage && this.selectedProject === 'all') {
      this.selectedProject = ONBOARDING_ASSIGNED_PROJECT_ID;
    }
    this.markShellChanged();
  }

  goHome(): void {
    if (this.onboardingAssignmentFlow) {
      this.frontDoorMode = 'assigned';
      this.selectedProject = this.pmoAssignmentReady ? ONBOARDING_ASSIGNED_PROJECT_ID : ONBOARDING_PM101_PROJECT_ID;
      this.selectedPage = 'workspace';
      this.selectedView = 'pm101';
      this.onboardingPm101Locked = !this.pmoAssignmentReady;
      this.notificationPanelOpen = false;
      this.markShellChanged();
      return;
    }
    this.selectedProject = this.onboardingProjectSetup ? ONBOARDING_ASSIGNED_PROJECT_ID : this.onboardingPm101Locked ? ONBOARDING_PM101_PROJECT_ID : 'all';
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

  setWorkspaceView(view: WorkspaceView): void {
    if (this.frontDoorMode === 'unassigned' || this.onboardingPm101Locked) return;
    this.selectedPage = 'workspace';
    this.selectedView = view;
    this.notificationPanelOpen = false;
    this.markShellChanged();
  }

  applyContentState(state: Partial<PmConsoleMountOptions>): void {
    this.selectedProject = state.projectId || this.selectedProject;
    let targetPage = (state.selectedPage as ConsolePage) || this.selectedPage;
    if (this.currentUser === 'fatima' && targetPage === 'workspaces') {
      targetPage = 'portfolio-workspace';
    }
    this.selectedPage = targetPage;
    this.selectedView = (state.selectedView as WorkspaceView) || this.selectedView;
    this.frontDoorMode = state.frontDoorMode || this.frontDoorMode;
    if ('pmoAssignmentReady' in state) {
      this.pmoAssignmentReady = Boolean(state.pmoAssignmentReady);
    }
    if ('guidedTourActive' in state) {
      this.guidedTourActive = Boolean(state.guidedTourActive);
    }
    if ('guidedTourExitMode' in state) {
      this.guidedTourExitMode = state.guidedTourExitMode ?? null;
    }
    if ('onboardingAssignmentFlow' in state) {
      this.onboardingAssignmentFlow = Boolean(state.onboardingAssignmentFlow);
    }
    if ('onboardingPm101Locked' in state) {
      this.onboardingPm101Locked = Boolean(state.onboardingPm101Locked);
    }
    if ('onboardingProjectSetup' in state) {
      this.onboardingProjectSetup = Boolean(state.onboardingProjectSetup);
    }
    if ('portfolioWorkspaceTab' in state) {
      this.portfolioWorkspaceTab = state.portfolioWorkspaceTab || 'overview';
    }
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

  private isRailItemDisabled(item: RailItem): boolean {
    if (item.disabled) return true;
    if (!item.page && !item.view) return false;
    if (item.home) return false;
    return this.frontDoorMode === 'unassigned' || this.onboardingPm101Locked;
  }

  private railItemDisabledTitle(item: RailItem): string | null {
    if (item.disabled) return item.disabledTitle ?? null;
    if (!this.isRailItemDisabled(item)) return null;
    return this.onboardingPm101Locked ? 'Available after PM 101 onboarding' : 'Available after PMO assigns a project';
  }

  private get currentRailItemId(): string {
    if (this.selectedPage === 'framework') return 'framework';
    if (this.selectedPage === 'performance') return 'performance';
    if (this.selectedPage === 'workspaces' || this.selectedPage === 'portfolio-workspace' || ['wbs', 'project-plan', 'playground'].includes(this.selectedPage)) return 'register';
    if (this.selectedPage === 'workspace' && this.selectedView === 'pm101') return 'home';
    if (this.selectedPage === 'workspace') return 'dashboards';
    return '';
  }

  private isRailItemUnavailable(itemId: string): boolean {
    const railItem = [...this.primaryRailItems, ...this.utilityRailItems].find((candidate) => candidate.id === itemId);
    return railItem ? !!railItem.disabled : false;
  }
}
