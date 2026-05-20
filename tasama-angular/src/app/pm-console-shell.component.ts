import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PmConsoleContentComponent } from './pm-console-content.component';
import { PmConsoleIconService } from './pm-console-icon.service';
import { PmConsoleMountOptions, ProjectOption } from './pm-console.types';
import { PmConsoleNotificationsComponent } from './pm-console-notifications.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleSideNavComponent, type PmConsoleSideNavItem } from './shared/pm-console-side-nav.component';

interface RailItem extends PmConsoleSideNavItem {
  page?: ConsolePage;
  view?: WorkspaceView;
  home?: boolean;
}

type ConsolePage = 'workspace' | 'workspaces' | 'wbs' | 'project-plan' | 'playground';
type WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages';
const ONBOARDING_PM101_PROJECT_ID = 'all';

@Component({
  selector: 'app-pm-console-shell',
  standalone: true,
  imports: [PmConsoleContentComponent, PmConsoleIconComponent, PmConsoleNotificationsComponent, PmConsoleSideNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modern-shell" [class.playground-mode]="selectedPage === 'playground'" [class.wbs-mode]="selectedPage === 'wbs'" [class.project-plan-mode]="selectedPage === 'project-plan'" [class.unassigned-mode]="frontDoorMode === 'unassigned'">
      <header class="app-header" [class.unassigned-header]="frontDoorMode === 'unassigned'" [class.workspaces-header]="usesConsoleHeader">
        <div class="brand-block">
          <button
            class="brand-logo-button"
            type="button"
            aria-label="Go to home"
            (click)="goHome()"
          >
            <img class="brand-logo" src="./assets/tasama-small.svg" alt="Tasama" />
          </button>

          @if (usesConsoleHeader) {
            <span class="brand-divider" aria-hidden="true"></span>
            <span class="brand-title">PM Console</span>
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
          <button class="round-button" type="button" aria-label="Theme">
            <span pmConsoleIcon="sun" aria-hidden="true"></span>
          </button>
          <button class="round-button notification-button" [class.active]="notificationPanelOpen" type="button" aria-label="Notifications" [attr.aria-expanded]="notificationPanelOpen" (click)="toggleNotifications()">
            <span pmConsoleIcon="bell" aria-hidden="true"></span>
            <span class="notification-badge" aria-hidden="true"></span>
          </button>
          <button class="profile-chip" type="button">
            <span class="avatar-xl">MH<i></i></span>
            <span><strong>Muna Hassan</strong><small>Senior Analyst</small></span>
          </button>
        </div>
      </header>

      <app-pm-console-side-nav
        [primaryItems]="primaryRailItems"
        [utilityItems]="utilityRailItems"
        [activeItemId]="activeRailItemId"
        (itemSelected)="onRailItemClick($event)"
      />

      <app-pm-console-content
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
        (consoleStateChange)="applyContentState($event)"
      />
      <app-pm-console-notifications [open]="notificationPanelOpen" (closePanel)="closeNotifications()" />
    </div>
  `,
})
export class PmConsoleShellComponent implements OnInit, AfterViewChecked {
  @Input() initialState: PmConsoleMountOptions = {};

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

  readonly topRailItems: RailItem[] = [
    { id: 'home', icon: 'house', label: 'Home', page: 'workspace', home: true },
    { id: 'register', icon: 'layout-grid', label: 'Register', page: 'workspaces' },
    { id: 'dashboards', icon: 'chart-column', label: 'Dashboards', page: 'workspace', view: 'board' },
  ];

  readonly bottomRailItems: RailItem[] = [
    { id: 'help', icon: 'circle-help', label: 'Help' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  selectedProject = 'all';
  selectedPage: ConsolePage = 'workspace';
  selectedView: WorkspaceView = 'board';
  frontDoorMode = 'assigned';
  notificationPanelOpen = false;
  pmoAssignmentReady = false;
  guidedTourActive = false;
  guidedTourExitMode: string | null = null;
  onboardingAssignmentFlow = false;
  onboardingPm101Locked = false;
  onboardingProjectSetup = false;
  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly iconsService: PmConsoleIconService,
  ) {}

  get isProjectScopedPage(): boolean {
    return this.selectedPage === 'playground' || this.selectedPage === 'wbs' || this.selectedPage === 'project-plan';
  }

  get usesConsoleHeader(): boolean {
    return this.frontDoorMode !== 'unassigned' && (this.selectedPage === 'workspace' || this.selectedPage === 'workspaces');
  }

  get primaryRailItems(): readonly RailItem[] {
    return this.topRailItems.map((item) => ({
      ...item,
      disabled: this.isRailItemDisabled(item),
      disabledTitle: this.railItemDisabledTitle(item),
    }));
  }

  get utilityRailItems(): readonly RailItem[] {
    return this.bottomRailItems;
  }

  get activeRailItemId(): string {
    if (this.selectedPage === 'workspaces' || ['wbs', 'project-plan', 'playground'].includes(this.selectedPage)) return 'register';
    if (this.selectedPage === 'workspace' && this.selectedView === 'board') return 'dashboards';
    if (this.selectedPage === 'workspace') return 'home';
    return '';
  }

  ngOnInit(): void {
    this.selectedProject = this.initialState.projectId || 'all';
    this.selectedPage = (this.initialState.selectedPage as ConsolePage) || 'workspace';
    this.selectedView = (this.initialState.selectedView as WorkspaceView) || 'board';
    this.frontDoorMode = this.initialState.frontDoorMode || 'assigned';
    this.guidedTourActive = Boolean(this.initialState.guidedTourActive);
    this.guidedTourExitMode = this.initialState.guidedTourExitMode ?? null;
    this.pmoAssignmentReady = Boolean(this.initialState.pmoAssignmentReady);
    this.onboardingAssignmentFlow = Boolean(this.initialState.onboardingAssignmentFlow);
    this.onboardingPm101Locked = Boolean(this.initialState.onboardingPm101Locked);
    this.onboardingProjectSetup = Boolean(this.initialState.onboardingProjectSetup);
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
    if (this.onboardingAssignmentFlow && this.pmoAssignmentReady && !this.onboardingProjectSetup && page === 'workspaces') {
      this.onboardingProjectSetup = true;
      this.onboardingPm101Locked = false;
      this.selectedProject = 'UAE Research Map';
      this.selectedView = 'pm101';
    }
    this.selectedPage = page;
    if (this.isProjectScopedPage && this.selectedProject === 'all') {
      this.selectedProject = this.onboardingProjectSetup ? 'UAE Research Map' : 'Vision 2030';
    }
    this.markShellChanged();
  }

  goHome(): void {
    if (this.onboardingAssignmentFlow && !this.onboardingProjectSetup) {
      this.frontDoorMode = 'assigned';
      this.selectedProject = 'all';
      this.selectedPage = 'workspace';
      this.selectedView = 'pm101';
      this.onboardingPm101Locked = !this.pmoAssignmentReady;
      this.notificationPanelOpen = false;
      this.markShellChanged();
      return;
    }
    this.selectedProject = this.onboardingProjectSetup ? 'UAE Research Map' : this.onboardingPm101Locked ? ONBOARDING_PM101_PROJECT_ID : 'all';
    this.selectedPage = this.onboardingProjectSetup ? 'workspaces' : 'workspace';
    this.selectedView = this.onboardingProjectSetup || this.onboardingPm101Locked ? 'pm101' : 'board';
    this.notificationPanelOpen = false;
    this.markShellChanged();
  }

  onRailItemClick(item: PmConsoleSideNavItem): void {
    const railItem = [...this.topRailItems, ...this.bottomRailItems].find((candidate) => candidate.id === item.id);
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

  toggleNotifications(): void {
    this.notificationPanelOpen = !this.notificationPanelOpen;
    this.markShellChanged();
  }

  closeNotifications(): void {
    if (!this.notificationPanelOpen) return;
    this.notificationPanelOpen = false;
    this.markShellChanged();
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
    this.selectedPage = (state.selectedPage as ConsolePage) || this.selectedPage;
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
    this.markShellChanged();
  }

  private markShellChanged(): void {
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  private isRailItemDisabled(item: RailItem): boolean {
    if (!item.page && !item.view) return false;
    if (item.home) return false;
    return this.frontDoorMode === 'unassigned' || this.onboardingPm101Locked;
  }

  private railItemDisabledTitle(item: RailItem): string | null {
    if (!this.isRailItemDisabled(item)) return null;
    return this.onboardingPm101Locked ? 'Available after PM 101 onboarding' : 'Available after PMO assigns a project';
  }
}
