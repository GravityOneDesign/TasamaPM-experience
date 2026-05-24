import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection, inject } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import { SdzAuthInterceptor } from './features/auth/interceptors/sdz-auth.interceptor';
import { UserSessionService } from './features/auth/services/user-session.service';

export function initUserSession(userService: UserSessionService): () => Promise<boolean> {
  return () => userService.getUserSession().catch(() => false);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SdzAuthInterceptor,
      multi: true,
    },
    provideAppInitializer(() => initUserSession(inject(UserSessionService))()),
  ],
};
