import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

const AUTH_TOKEN_KEY = 'hsSdzAuth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getToken(): string | null {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  }

  setToken(token: unknown): void {
    const normalizedToken = this.normalizeToken(token);
    if (normalizedToken) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, normalizedToken);
    }
  }

  clearToken(): void {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  getCookieByName(name: string): string {
    const encodedName = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith(encodedName));

    return cookie ? decodeURIComponent(cookie.substring(encodedName.length)) : '';
  }

  callSDZLogin(): void {
    const baseUrl = environment.sdzBaseUrl.replace(/\/$/, '');
    const refUrl = encodeURIComponent(window.location.href);
    window.location.href = `${baseUrl}/Account/Login?refUrl=${refUrl}`;
  }

  private normalizeToken(token: unknown): string | null {
    if (typeof token === 'string') {
      return token;
    }

    if (token && typeof token === 'object') {
      const tokenRecord = token as Record<string, unknown>;
      const tokenValue = tokenRecord['token'] ?? tokenRecord['access_token'] ?? tokenRecord['accessToken'];
      return typeof tokenValue === 'string' ? tokenValue : null;
    }

    return null;
  }
}
