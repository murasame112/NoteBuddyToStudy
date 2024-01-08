import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isUserLogin = authService.currentUserSignal();

  // if (isUserLogin?.role === 'admin') {
  //   return true;
  // } else {
  //   router.navigateByUrl('error');
  //   return false;
  // }

  return toObservable(authService.currentUserSignal).pipe(
    filter((user) => user !== undefined),
    map((user) => {
      if (user?.role !== 'admin') {
        router.navigateByUrl('error');
        return false;
      }
      return true;
    })
  );
};
