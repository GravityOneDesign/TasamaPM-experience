import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { DevAuthService } from '../services/dev-auth.service';
import { UserSessionService } from '../services/user-session.service';

export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const devService = inject(DevAuthService);
  const router = inject(Router);
  const userSession = inject(UserSessionService);

  if (userSession.isAuthenticated()) {
    return true;
  }

  if (environment.production) {
    auth.callSDZLogin();
    return false;
  }

  devService.setDevLoginStatus(true);
  return router.createUrlTree(['/login']);
};
