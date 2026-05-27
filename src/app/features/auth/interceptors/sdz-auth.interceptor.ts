import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class SdzAuthInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const normalizedUrl = request.url.toLowerCase();

    if (this.isImplicitLoginUrl(normalizedUrl)) {
      const secureToken = this.auth.getCookieByName('secure_token');
      return next.handle(
        request.clone({
          withCredentials: true,
          setHeaders: {
            secure_token: secureToken,
            'x-requested-with': 'XMLHttpRequest',
          },
        }),
      );
    }

    if (this.isAuthUrl(normalizedUrl)) {
      return next.handle(request.clone({ withCredentials: true }));
    }

    const token = this.auth.getToken() ?? '';
    const xsrfToken = this.auth.getCookieByName('XSRF-TOKEN');
    const secureToken = this.auth.getCookieByName('secure_token');

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'X-XSRF-TOKEN': xsrfToken,
      withCredentials: 'true',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    };

    if (!environment.production) {
      headers['secure_token'] = secureToken;
      headers['x-requested-with'] = 'XMLHttpRequest';
    }

    return next.handle(
      request.clone({
        withCredentials: true,
        setHeaders: headers,
      }),
    );
  }

  private isAuthUrl(url: string): boolean {
    return (
      this.includesAccountEndpoint(url, 'loginuser') ||
      this.includesAccountEndpoint(url, 'refreshantiforgerytoken') ||
      this.isImplicitLoginUrl(url)
    );
  }

  private isImplicitLoginUrl(url: string): boolean {
    return this.includesAccountEndpoint(url, 'implicitlogin');
  }

  private includesAccountEndpoint(url: string, endpoint: string): boolean {
    return url.includes(`/account/${endpoint}`) || url.endsWith(`account/${endpoint}`);
  }
}
