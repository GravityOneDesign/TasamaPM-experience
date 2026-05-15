import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PmConsoleContentComponent } from './pm-console-content.component';
import { PmConsoleIconService } from './pm-console-icon.service';
import { PmConsoleMountOptions } from './pm-console.types';
import { PmConsoleNotificationsComponent } from './pm-console-notifications.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

interface ProjectOption {
  id: string;
  name: string;
}

interface RailItem {
  icon: string;
  label: string;
  page?: ConsolePage;
  home?: boolean;
}

type ConsolePage = 'workspace' | 'workspaces' | 'wbs' | 'project-plan' | 'playground';
type WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages';
const ONBOARDING_PM101_PROJECT_ID = 'all';

@Component({
  selector: 'app-pm-console-shell',
  standalone: true,
  imports: [FormsModule, PmConsoleContentComponent, PmConsoleIconComponent, PmConsoleNotificationsComponent],
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
          } @else {
            <label class="project-switch" data-tour-target="project-switch">
              <span class="project-switch-label">Viewing</span>
              <span class="project-select-wrap">
                <select [ngModel]="headerProject" aria-label="Select project" (ngModelChange)="selectProject($event)">
                  @for (project of visibleProjects; track project.id) {
                    <option [value]="project.id">{{ project.name }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>
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

      <aside class="side-rail" data-tour-target="side-navigation">
        <nav>
          @for (item of topRailItems; track item.label) {
            <button
              class="rail-button"
              [class.active]="isRailActive(item.page)"
              type="button"
              [attr.aria-label]="item.label"
              [disabled]="frontDoorMode === 'unassigned' && item.page !== 'workspace'"
              [attr.aria-disabled]="frontDoorMode === 'unassigned' && item.page !== 'workspace' ? 'true' : null"
              [attr.title]="frontDoorMode === 'unassigned' && item.page !== 'workspace' ? 'Available after PMO assigns a project' : null"
              (click)="onRailItemClick(item)"
            >
              <span [pmConsoleIcon]="item.icon" aria-hidden="true"></span>
            </button>
          }
        </nav>
        <nav>
          <button class="rail-button" type="button" aria-label="Help"><span pmConsoleIcon="circle-help" aria-hidden="true"></span></button>
          <button class="rail-button" type="button" aria-label="Logout"><span pmConsoleIcon="log-out" aria-hidden="true"></span></button>
        </nav>
      </aside>

      <app-pm-console-content
        [selectedProject]="selectedProject"
        [selectedPage]="selectedPage"
        [selectedView]="selectedView"
        [frontDoorMode]="frontDoorMode"
        [pmoAssignmentReady]="pmoAssignmentReady"
        [guidedTourActive]="guidedTourActive"
        [guidedTourExitMode]="guidedTourExitMode"
        [onboardingPm101Locked]="onboardingPm101Locked"
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
    { icon: 'house', label: 'Home', page: 'workspace', home: true },
    { icon: 'layout-grid', label: 'Project Register', page: 'workspaces' },
    { icon: 'chart-column', label: 'Reports', page: undefined },
    { icon: 'building-2', label: 'Departments', page: undefined },
    { icon: 'circle-dollar-sign', label: 'Benefits', page: undefined },
    { icon: 'user-round', label: 'People', page: undefined },
    { icon: 'settings', label: 'Settings', page: undefined },
  ];

  selectedProject = 'all';
  selectedPage: ConsolePage = 'workspace';
  selectedView: WorkspaceView = 'calendar';
  frontDoorMode = 'assigned';
  notificationPanelOpen = false;
  pmoAssignmentReady = false;
  guidedTourActive = false;
  guidedTourExitMode: string | null = null;
  onboardingPm101Locked = false;
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

  get headerProject(): string {
    if (this.onboardingPm101Locked) return 'all';
    return this.selectedPage === 'playground' && this.selectedProject === 'all' ? 'Vision 2030' : this.selectedProject;
  }

  get visibleProjects(): ProjectOption[] {
    if (this.onboardingPm101Locked) return this.projects.filter((project) => project.id === 'all');
    return this.isProjectScopedPage ? this.projects.filter((project) => project.id !== 'all') : this.projects;
  }

  ngOnInit(): void {
    this.selectedProject = this.initialState.projectId || 'all';
    this.selectedPage = (this.initialState.selectedPage as ConsolePage) || 'workspace';
    this.selectedView = (this.initialState.selectedView as WorkspaceView) || 'calendar';
    this.frontDoorMode = this.initialState.frontDoorMode || 'assigned';
    this.guidedTourActive = Boolean(this.initialState.guidedTourActive);
    this.guidedTourExitMode = this.initialState.guidedTourExitMode ?? null;
    this.pmoAssignmentReady = Boolean(this.initialState.pmoAssignmentReady);
    this.onboardingPm101Locked = Boolean(this.initialState.onboardingPm101Locked);
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

  selectProject(value: string): void {
    this.selectedProject = this.onboardingPm101Locked ? ONBOARDING_PM101_PROJECT_ID : value;
    this.markShellChanged();
  }

  setPage(page: ConsolePage): void {
    if (this.frontDoorMode === 'unassigned' && page !== 'workspace') return;
    this.selectedPage = page;
    if (this.isProjectScopedPage && this.selectedProject === 'all') {
      this.selectedProject = 'Vision 2030';
    }
    this.markShellChanged();
  }

  goHome(): void {
    this.selectedProject = this.onboardingPm101Locked ? ONBOARDING_PM101_PROJECT_ID : 'all';
    this.selectedPage = 'workspace';
    this.selectedView = this.onboardingPm101Locked ? 'pm101' : 'calendar';
    this.notificationPanelOpen = false;
    this.markShellChanged();
  }

  onRailItemClick(item: RailItem): void {
    if (item.home) {
      this.goHome();
      return;
    }
    if (item.page) {
      this.setPage(item.page);
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

  isRailActive(page: ConsolePage | undefined): boolean {
    if (!page) return false;
    return page === this.selectedPage || (page === 'workspaces' && ['wbs', 'project-plan'].includes(this.selectedPage));
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
    if ('onboardingPm101Locked' in state) {
      this.onboardingPm101Locked = Boolean(state.onboardingPm101Locked);
    }
    this.markShellChanged();
  }

  private markShellChanged(): void {
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }
}
