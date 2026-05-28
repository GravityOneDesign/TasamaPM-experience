import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  UserSessionInfo,
  buildUserDisplayName,
  buildUserInitials,
  formatUserRoleLabel,
  resolveConsoleLandingRole,
  type ConsoleLandingRole,
} from '../models/user-session-info.model';
import { AuthService } from './auth.service';
import { DevAuthService } from './dev-auth.service';

export type { UserSessionInfo, ConsoleLandingRole };

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private authenticated = false;
  private readonly sessionSignal = signal<UserSessionInfo | null>(null);
  private readonly sdzBaseUrl = environment.sdzBaseUrl.replace(/\/$/, '');
  private readonly cdApiBaseUrl = environment.cdApiBaseUrl.replace(/\/$/, '');

  readonly session = this.sessionSignal.asReadonly();
  readonly displayName = computed(() => buildUserDisplayName(this.sessionSignal()));
  readonly roleLabel = computed(() => formatUserRoleLabel(this.sessionSignal()?.userRoleName));
  readonly initials = computed(() => buildUserInitials(this.sessionSignal()));
  readonly landingRole = computed(() => resolveConsoleLandingRole(this.sessionSignal()?.userRoleName));

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
    private readonly devService: DevAuthService,
    private readonly router: Router,
  ) {}

  getUserSession(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.refreshAntiforgeryToken().subscribe({
        next: () => {
          if (this.auth.getToken()) {
            this.loadUserSessionInfo(resolve, reject);
          } else {
            this.getJwtToken().subscribe({
              next: (token) => {
                this.auth.setToken(token);
                this.loadUserSessionInfo(resolve, reject);
              },
              error: () => {
                this.handleAuthFailure();
                resolve(false);
              },
            });
          }
        },
        error: () => {
          this.handleAuthFailure();
          resolve(false);
        },
      });
    });
  }

  refreshAntiforgeryToken(): Observable<unknown> {
    return this.http.get(`${this.sdzBaseUrl}/Account/RefreshAntiforgeryToken`);
  }

  getJwtToken(): Observable<unknown> {
    return this.http.get(`${this.sdzBaseUrl}/Account/ImplicitLogin`);
  }

  getSessionUserInfo(): Observable<UserSessionInfo> {
    return this.http.get<UserSessionInfo>(`${this.cdApiBaseUrl}/access/GetUserSessionInfo`);
  }

  isAuthenticated(): boolean {
    return this.authenticated || this.auth.isAuthenticated();
  }

  getConsoleLandingRole(): ConsoleLandingRole {
    return this.landingRole();
  }

  private loadUserSessionInfo(resolve: (value: boolean) => void, reject: (reason?: unknown) => void): void {
    this.getSessionUserInfo().subscribe({
      next: (res) => {
        this.storeSessionInfo(res);
        this.devService.setDevLoginStatus(false);
        this.authenticated = true;
        resolve(true);
      },
      error: (error) => {
        this.auth.clearToken();
        this.authenticated = false;
        this.sessionSignal.set(null);
        this.handleAuthFailure();
        reject(error);
      },
    });
  }

  private storeSessionInfo(res: UserSessionInfo): void {
    this.sessionSignal.set(res);
    this.setNullableLocalStorage('aiDashboardId', res.aiDashboardId);
    this.setNullableLocalStorage('companyId', res.companyId);
    this.setNullableLocalStorage('currentRoleId', res.roleId);
    this.setNullableLocalStorage('clientId', res.externalClientID);
    this.setNullableLocalStorage('external', res.isExternal);
  }

  private setNullableLocalStorage(key: string, value: boolean | number | string | null | undefined): void {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, value.toString());
  }

  private handleAuthFailure(): void {
    if (environment.production) {
      this.auth.callSDZLogin();
    } else {
      this.devService.setDevLoginStatus(true);
      void this.router.navigate(['/login']);
    }
  }
}
