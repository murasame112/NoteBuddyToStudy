import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { CustomValidators } from 'src/app/helpers/custom-validators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { User } from 'src/app/models/user.model';

import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent extends Unsubscribe implements OnInit {
  editUserForm!: FormGroup;
  username: string | undefined = '';
  userPass: string | undefined = '';
  userEmail: string | undefined = '';
  user!: User;
  userImg: string | undefined = '';
  isLoading: Boolean = true;
  isGoogleUser: boolean | undefined = undefined;

  constructor(
    public authService: AuthService,
    private usersService: UsersService
  ) {
    super();
  }
  ngOnInit(): void {
    this.userSettings();

    this.editUserForm = new FormGroup({
      img: new FormControl(''),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        CustomValidators.spaceValidator(),
        CustomValidators.lowercaseValidator(),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        CustomValidators.passwordValidation(),
        CustomValidators.spaceValidator(),
      ]),
    });

    this.isGoogleUser = this.authService.currentUserSignal()?.is_google;
  }

  userSettings() {
    this.authService
      .isUserLogin()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.authService.currentUserSignal.set(result);
        this.username = this.authService.currentUserSignal()?.login;
        this.userPass = this.authService.getUserPass();
        this.userImg = this.authService.currentUserSignal()?.avatar_url;
        this.userEmail = this.authService.currentUserSignal()?.email;

        this.editUserForm.patchValue({
          email: this.userEmail,
          password: this.userPass,
        });

        this.isLoading = false;
      });
  }

  changeEmail() {
    let email = this.editUserForm.get('email')?.value;
    let userId = this.authService.currentUserSignal()?._id;

    let queryAndValue = {
      email: email,
    };

    if (this.editUserForm.valid) {
      if (userId) {
        this.usersService
          .updateUserField(userId, queryAndValue)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((res) => {});
      }
    }
  }

  changePassword() {
    let pass = this.editUserForm.get('password')?.value;
    let userId = this.authService.currentUserSignal()?._id;

    let queryAndValue = {
      password: pass,
    };

    if (this.editUserForm.valid) {
      if (userId) {
        this.usersService
          .updateUserField(userId, queryAndValue)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((res) => {});
      }
    }
  }

  changeAvatarApi() {
    let userId = this.authService.currentUserSignal()?._id;

    let queryAndValue = {
      avatar_url: this.userImg,
    };

    if (userId) {
      this.usersService
        .updateUserField(userId, queryAndValue)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {});
    }
  }

  changeAvatar(event: any) {
    const image: File = event.target.files[0];

    if (image) {
      if (image.type.match(/image.*/)) {
        const reader = new FileReader();
        reader.onload = (element: any) => {
          const img: string = element.target.result;

          const newImg = new Image();
          newImg.src = img;

          newImg.onload = () => {
            const width = newImg.width;
            const height = newImg.height;

            if (width > 640 || height > 640) {
              alert('wybrane zdjęcie jest większe niż 640x640 pikseli');
            } else {
              if (image.size > 1024 * 1024) {
                alert('wybrane zdjęcie jest większe niż 1MB');
              }
              this.userImg = img;
              this.changeAvatarApi();
            }
          };
        };
        reader.readAsDataURL(image);
      } else {
        alert('Niepoprawny format pliku');
      }
    }
  }
}
