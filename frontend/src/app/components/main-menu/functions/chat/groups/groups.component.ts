import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Group } from 'src/app/models/group.model';
import { AuthService } from 'src/app/services/auth.service';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent extends Unsubscribe implements OnInit {
  constructor(
    public authService: AuthService,
    private groupsService: GroupsService
  ) {
    super();
  }

  isLoading: Boolean = true;
  userId: string | undefined = this.authService.currentUserSignal()?._id;
  groups: Group[] = [];
  isLoadingChat: Boolean = false;

  ngOnInit(): void {
    this.getUserGroups();
  }

  getUserGroups() {
    if (this.userId) {
      this.groupsService
        .getGroupsByUserId(this.userId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (groups) => {
            this.isLoading = false;
            this.groups = groups;
          },
          (error) => {}
        );
    }
  }

  leaveGroup(groupId: string) {
    let group: any = this.groups.filter((group) => group._id === groupId);

    let groupWithoutCurrentUser: string[] = group[0].users.filter(
      (user: any) => user !== this.userId
    );

    let updatedUsersGroup: any = {
      users: groupWithoutCurrentUser,
    };

    this.groupsService
      .deleteUserFromGroup(groupId, updatedUsersGroup)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {},
        (error) => {}
      );

    this.groups = this.groups.filter((group) => group._id !== groupId);
  }

  waitToLoadChat(wait: boolean) {
    this.isLoadingChat = true;
  }
}
