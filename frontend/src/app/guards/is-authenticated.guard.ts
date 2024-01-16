import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.currentUserSignal).pipe(
    filter((user) => user !== undefined),
    map((user) => {
      if (!user) {
        router.navigateByUrl('/login');
        return false;
      } else {
        return true;
      }
    })
  );
};
