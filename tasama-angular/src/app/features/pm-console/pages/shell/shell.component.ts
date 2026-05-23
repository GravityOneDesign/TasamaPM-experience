import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PmConsoleContentComponent } from '../workspace/workspace.component';
import { PmConsoleIconService } from '../../../../core/services/icon.service';
import { PmConsoleMountOptions, ProjectOption } from '../../models/pm-console.types';
import { PmConsoleNotificationsComponent } from '../notifications/notifications.component';
import { PmConsoleAgentDockComponent } from '../../../../shared/components/agent/agent-dock/agent-dock.component';
import { PmConsoleSideNavComponent, type PmConsoleSideNavItem } from '../../../../shared/components/layout/side-nav/side-nav.component';
import { PmConsoleTopBarComponent } from '../../../../shared/components/layout/top-bar/top-bar.component';

interface RailItem extends PmConsoleSideNavItem {
  page?: ConsolePage;
  view?: WorkspaceView;
  home?: boolean;
}

type ConsolePage = 'workspace' | 'workspaces' | 'wbs' | 'project-plan' | 'playground';
type WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages';
const ONBOARDING_PM101_PROJECT_ID = 'all';
const ONBOARDING_ASSIGNED_PROJECT_ID = 'UAE Research Map';

@Component({
  selector: 'app-pm-console-shell',
  standalone: true,
  imports: [PmConsoleAgentDockComponent, PmConsoleContentComponent, PmConsoleNotificationsComponent, PmConsoleSideNavComponent, PmConsoleTopBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modern-shell" [class.side-nav-expanded]="sideNavExpanded" [class.playground-mode]="selectedPage === 'playground'" [class.wbs-mode]="selectedPage === 'wbs'" [class.project-plan-mode]="selectedPage === 'project-plan'" [class.unassigned-mode]="frontDoorMode === 'unassigned'">
      <app-pm-console-top-bar
        [showConsoleHeader]="usesConsoleHeader"
        [unassigned]="frontDoorMode === 'unassigned'"
        [pmoAssignmentReady]="pmoAssignmentReady"
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
      <app-pm-console-agent-dock />
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
  sideNavExpanded = false;
  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly iconsService: PmConsoleIconService,
  ) {}

  get isProjectScopedPage(): boolean {
    return this.selectedPage === 'playground' || this.selectedPage === 'wbs' || this.selectedPage === 'project-plan';
  }

  get usesConsoleHeader(): boolean {
    return this.frontDoorMode !== 'unassigned';
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
    const activeItemId = this.currentRailItemId;
    return this.isRailItemUnavailable(activeItemId) ? '' : activeItemId;
  }

  ngOnInit(): void {
    this.forgetSideNavExpandedPreference();
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
      this.selectedProject = ONBOARDING_ASSIGNED_PROJECT_ID;
      this.selectedView = 'pm101';
    }
    this.selectedPage = page;
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
    if (this.selectedPage === 'workspaces' || ['wbs', 'project-plan', 'playground'].includes(this.selectedPage)) return 'register';
    if (this.selectedPage === 'workspace' && this.selectedView === 'pm101') return 'home';
    if (this.selectedPage === 'workspace') return 'dashboards';
    return '';
  }

  private isRailItemUnavailable(itemId: string): boolean {
    const railItem = [...this.topRailItems, ...this.bottomRailItems].find((candidate) => candidate.id === itemId);
    return railItem ? this.isRailItemDisabled(railItem) : false;
  }
}

