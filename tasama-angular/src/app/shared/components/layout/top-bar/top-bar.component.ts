import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-pm-console-top-bar',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <header class="app-header" [class.unassigned-header]="unassigned" [class.workspaces-header]="showConsoleHeader">
      <div class="brand-block">
        <button
          class="brand-logo-button"
          type="button"
          aria-label="Go to home"
          (click)="homeSelected.emit()"
        >
          <img class="brand-logo" src="./assets/tasama-small.svg" alt="Tasama" />
        </button>

        @if (showConsoleHeader) {
          <span class="brand-divider" aria-hidden="true"></span>
          <span class="brand-title">PM Console</span>
        }

        @if (unassigned) {
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
        @if (showConsoleHeader) {
          <label class="search-box global-console-search">
            <span pmConsoleIcon="search" aria-hidden="true"></span>
            <input type="search" aria-label="Search documents, people, or departments" placeholder="Search documents, people, or departments..." />
          </label>
        }
        <button class="round-button notification-button" [class.active]="notificationPanelOpen" type="button" aria-label="Notifications" [attr.aria-expanded]="notificationPanelOpen" (click)="notificationsToggled.emit()">
          <span pmConsoleIcon="bell" aria-hidden="true"></span>
          <span class="notification-badge" aria-hidden="true"></span>
        </button>
        <button class="profile-chip" type="button">
          <span class="avatar-xl">MH<i></i></span>
          <span><strong>Muna Hassan</strong><small>Project Manager</small></span>
        </button>
      </div>
    </header>
  `,
})
export class PmConsoleTopBarComponent {
  @Input() showConsoleHeader = true;
  @Input() unassigned = false;
  @Input() pmoAssignmentReady = false;
  @Input() notificationPanelOpen = false;

  @Output() readonly homeSelected = new EventEmitter<void>();
  @Output() readonly notificationsToggled = new EventEmitter<void>();
}
