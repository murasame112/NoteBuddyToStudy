import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { ChatService } from '../services/chat.service';

export const chatGuard: CanActivateFn = (route, state) => {
  const chatService = inject(ChatService);
  const router = inject(Router);

  const group_id = route.params['id'];

  return chatService.checkIfUserIsInGroup(group_id).pipe(
    map((res) => {
      let usersInGroup: any[] = res[0];
      let currentUser: any = res[1];

      if (typeof currentUser !== undefined || typeof currentUser !== null) {
        let isUserInGroup = usersInGroup.some(
          (user) => user.login === currentUser.login
        );

        if (isUserInGroup) {
          return isUserInGroup;
        } else {
          router.navigateByUrl('/notes');
          return isUserInGroup;
        }
      } else {
        return false;
      }
    })
  );
};
