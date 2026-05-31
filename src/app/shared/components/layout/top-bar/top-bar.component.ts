import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, switchMap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { UserSessionService } from '../../../../features/auth/services/user-session.service';
import { PmConsoleIconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-pm-console-top-bar',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pm-console-top-bar',
  },
  styles: [
    `
      :host {
        display: contents;
      }

      .profile-chip-wrapper {
        position: relative;
      }

      .profile-chip {
        cursor: pointer;
      }

      .user-menu {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        min-width: 160px;
        padding: 6px;
        position: absolute;
        right: 0;
        top: calc(100% + 6px);
        z-index: 1000;
      }

      .user-menu-item {
        align-items: center;
        appearance: none;
        background: transparent;
        border: 0;
        border-radius: 7px;
        color: #374151;
        cursor: pointer;
        display: flex;
        font-size: 13px;
        font-weight: 500;
        gap: 8px;
        padding: 8px 10px;
        text-align: left;
        transition: background 0.15s;
        width: 100%;
      }

      .user-menu-item:hover {
        background: #f3f4f6;
      }

      .user-menu-item:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .user-menu-item.logout-item {
        color: #dc2626;
      }

      .user-menu-item.logout-item:hover {
        background: #fef2f2;
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

        <div class="profile-chip-wrapper">
          <button
            class="profile-chip"
            type="button"
            aria-haspopup="menu"
            [attr.aria-expanded]="userMenuOpen"
            aria-label="User menu"
            (click)="toggleUserMenu()"
          >
            <span class="avatar-xl">{{ userSession.initials() }}<i></i></span>
            <span><strong>{{ userSession.displayName() }}</strong><small>{{ userSession.roleLabel() }}</small></span>
            <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
          </button>

          @if (userMenuOpen) {
            <div class="user-menu" role="menu" aria-label="User options">
              <button
                class="user-menu-item logout-item"
                type="button"
                role="menuitem"
                [disabled]="loggingOut"
                (click)="logout()"
              >
                <span pmConsoleIcon="log-out" aria-hidden="true"></span>
                {{ loggingOut ? 'Logging out...' : 'Logout' }}
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
})
export class PmConsoleTopBarComponent {
  protected readonly userSession = inject(UserSessionService);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly elRef = inject(ElementRef);

  @Input() showConsoleHeader = true;
  @Input() unassigned = false;
  @Input() pmoAssignmentReady = false;
  @Input() notificationPanelOpen = false;

  @Output() readonly homeSelected = new EventEmitter<void>();
  @Output() readonly notificationsToggled = new EventEmitter<void>();

  userMenuOpen = false;
  loggingOut = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.userMenuOpen && !this.elRef.nativeElement.contains(event.target)) {
      this.userMenuOpen = false;
      this.cdr.markForCheck();
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    if (this.loggingOut) return;
    this.loggingOut = true;
    this.userMenuOpen = false;
    this.cdr.markForCheck();

    const sdzBase = environment.sdzBaseUrl.replace(/\/$/, '');

    this.http
      .get(`${sdzBase}/Account/LogOutUser`, { responseType: 'text' })
      .pipe(
        switchMap(() =>
          this.http.post(`${sdzBase}/businessplanAPI/Access/InvalidateToken`, {}, { responseType: 'text' }).pipe(
            catchError(() => of(null)),
          ),
        ),
        catchError(() => of(null)),
      )
      .subscribe({
        complete: () => this.redirectToLogin(sdzBase),
        error: () => this.redirectToLogin(sdzBase),
      });
  }

  private redirectToLogin(sdzBase: string): void {
    this.authService.clearToken();
    window.location.href = `${sdzBase}/Account/Login`;
  }
}
