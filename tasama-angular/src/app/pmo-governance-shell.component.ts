import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PmConsoleIconService } from './pm-console-icon.service';
import { PmConsoleNotificationsComponent } from './pm-console-notifications.component';
import { PmoGovernanceForumDetailDrawerComponent } from './pmo-governance-forum-detail-drawer.component';
import { PmoGovernanceWorkspaceComponent } from './pmo-governance-workspace.component';
import { pmoGovernanceForumRows, type PmoGovernanceForumRow } from './pmo-governance-workspace.data';
import { PmoFrontdoorComponent } from './pmo-frontdoor.component';
import { PmConsoleAgentDockComponent } from './shared/pm-console-agent-dock.component';
import { PmConsoleSideNavComponent, type PmConsoleSideNavItem } from './shared/pm-console-side-nav.component';
import { PmConsoleTopBarComponent } from './shared/pm-console-top-bar.component';

@Component({
  selector: 'app-pmo-governance-shell',
  standalone: true,
  imports: [
    PmoGovernanceForumDetailDrawerComponent,
    PmoGovernanceWorkspaceComponent,
    PmoFrontdoorComponent,
    PmConsoleAgentDockComponent,
    PmConsoleNotificationsComponent,
    PmConsoleSideNavComponent,
    PmConsoleTopBarComponent,
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
        <app-pmo-frontdoor (workspaceRequested)="openWorkspace()" />
      } @else {
        <app-pmo-governance-workspace [forums]="forums" (forumDetailSelected)="openForumDetail($event)" />
      }
      <app-pm-console-notifications [open]="notificationPanelOpen" (closePanel)="closeNotifications()" />
      <app-pm-console-agent-dock />

      @if (selectedForum; as forum) {
        <app-pmo-governance-forum-detail-drawer [forum]="forum" (forumUpdated)="updateForum($event)" (closeSelected)="closeForumDetail()" />
      }
    </div>
  `,
})
export class PmoGovernanceShellComponent implements AfterViewChecked {
  readonly primaryRailItems: readonly PmConsoleSideNavItem[] = [
    { id: 'home', icon: 'chart-column', label: 'Home' },
    { id: 'governance', icon: 'layout-grid', label: 'My Workspace' },
  ];

  readonly utilityRailItems: readonly PmConsoleSideNavItem[] = [
    { id: 'help', icon: 'circle-help', label: 'Help' },
    { id: 'sign-out', icon: 'log-out', label: 'Sign out' },
  ];

  activeSurface: 'frontdoor' | 'governance' = 'frontdoor';
  forums: readonly PmoGovernanceForumRow[] = pmoGovernanceForumRows;
  notificationPanelOpen = false;
  selectedForum: PmoGovernanceForumRow | null = null;
  sideNavExpanded = false;
  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly iconsService: PmConsoleIconService,
  ) {}

  get activeRailItemId(): string {
    return this.activeSurface === 'frontdoor' ? 'home' : 'governance';
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

  openWorkspace(): void {
    if (this.activeSurface !== 'governance') {
      this.activeSurface = 'governance';
      this.selectedForum = null;
      this.notificationPanelOpen = false;
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

  private markShellChanged(): void {
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }
}
