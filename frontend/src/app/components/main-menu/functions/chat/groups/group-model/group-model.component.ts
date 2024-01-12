import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { UsersService } from 'src/app/services/users.service';
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import { Group } from 'src/app/models/group.model';
import { takeUntil } from 'rxjs';
import { GroupData } from 'src/app/models/groupData.model';

@Component({
  selector: 'app-group-model',
  templateUrl: './group-model.component.html',
  styleUrls: ['./group-model.component.scss'],
})
export class GroupModelComponent extends Unsubscribe implements OnInit {
  @Input() groupData: Group | null = null;
  @Output() leaveGroup: EventEmitter<string> = new EventEmitter<string>();
  subcategoryName: string = '';
  username: string = '';
  username2: string = '';
  username3: string = '';
  username4: string = '';
  username5: string = '';
  userAvatar: string = '';
  userAvatar2: string = '';
  userAvatar3: string = '';
  userAvatar4: string = '';
  userAvatar5: string = '';
  users: GroupData[] = [];
  isLoading: boolean = true;
  constructor(
    private usersService: UsersService,
    private subcategoriesService: SubcategoriesService
  ) {
    super();
  }

  ngOnInit(): void {
    // console.log('data', this.groupData);
    this.getSubcategory();
    this.getUsers();
  }

  getSubcategory() {
    if (this.groupData) {
      this.subcategoriesService
        .getSubcategoryById(this.groupData?.subcategory_id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (subcategory) => {
            this.subcategoryName = subcategory.name;
          },
          (error) => {}
        );
    }
  }

  getUsers() {
    if (this.groupData?._id) {
      this.usersService
        .getUsersFromGroupId(this.groupData?._id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (users) => {
            this.users = users;
            // console.log(this.users);
            this.setGroupData();
            this.isLoading = false;
          },
          (error) => {}
        );
    }
  }

  setGroupData() {
    if (this.groupData?.type === 'two') {
      this.checkData(0, this.username, this.userAvatar);
      this.checkData(1, this.username2, this.userAvatar2);
    } else {
      this.checkData(0, this.username, this.userAvatar);
      this.checkData(1, this.username2, this.userAvatar2);
      this.checkData(2, this.username3, this.userAvatar3);
      this.checkData(3, this.username4, this.userAvatar4);
      this.checkData(4, this.username5, this.userAvatar5);
    }
  }

  checkData(index: number, usernameValue: string, avatarValue: string) {
    const user = this.users[index] || {};
    usernameValue = user.login || '';
    avatarValue = user.avatar_url || '';

    if (index === 0) {
      this.username = usernameValue;
      this.userAvatar = avatarValue;
    } else if (index === 1) {
      this.username2 = usernameValue;
      this.userAvatar2 = avatarValue;
    } else if (index === 2) {
      this.username3 = usernameValue;
      this.userAvatar3 = avatarValue;
    } else if (index === 3) {
      this.username4 = usernameValue;
      this.userAvatar4 = avatarValue;
    } else if (index === 4) {
      this.username5 = usernameValue;
      this.userAvatar5 = avatarValue;
    }
  }

  removeGroup() {
    if (this.groupData?._id) {
      this.leaveGroup.emit(this.groupData._id);
    }
  }
}
