import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isUserLogin = authService.currentUserSignal();

  if (isUserLogin != null || isUserLogin != undefined) {
    return true;
  } else {
    return router.navigateByUrl('/login');
  }
};
