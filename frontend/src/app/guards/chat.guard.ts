import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { GroupData } from '../models/groupData.model';
import { Observable, filter, forkJoin, map, of, take, tap } from 'rxjs';

export const chatGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const usersService = inject(UsersService);
  const router = inject(Router);

  const group_id = route.params['id'];
  // const userLogin = authService.currentUserSignal();
  let data: any[] | undefined = undefined;
  let data2: any | undefined = undefined;

  let usersInGroup = usersService.getUsersFromGroupId(group_id).pipe(
    take(1),
    map((users) => {
      console.log(authService.currentUserSignal);
      console.log('123', users);
      data = users;
      // return true;
    })
  );

  let loggedUser = toObservable(authService.currentUserSignal).pipe(
    filter((user) => user !== undefined),
    map((user) => {
      if (!user) {
        console.log('guard false: ', user);
        router.navigateByUrl('/login');
        data2 = user;
      } else {
        console.log('guard true: ', user);
        data2 = user;
      }
    })
  );

  // let sourceOne = of(usersInGroup);
  // let sourceTwo = of(loggedUser);
  // let sourceOne = of(data);
  // let sourceTwo = of(data2);
  let sourceOne = of(usersInGroup);
  let sourceTwo = of(loggedUser);

  return forkJoin([sourceOne, sourceTwo]).pipe(
    map((source) => {
      return true;
    })
  );

  // return true;
};
