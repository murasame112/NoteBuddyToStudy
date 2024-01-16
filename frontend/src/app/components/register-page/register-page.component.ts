import { Component, NgZone, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { CustomValidators } from 'src/app/helpers/custom-validators';
import { Router } from '@angular/router';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
declare var google: any;

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent extends Unsubscribe implements OnInit {
  public registerForm!: FormGroup;
  usersOrigin: User[] = [];
  observer: any;
  isLoading: boolean = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {
    super();
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      login: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        CustomValidators.lowercaseValidator(),
        CustomValidators.spaceValidator(),
        CustomValidators.specialCharactersValidator(),
      ]),
      mail: new FormControl('', [
        Validators.required,
        Validators.email,
        CustomValidators.spaceValidator(),
        CustomValidators.lowercaseValidator(),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        CustomValidators.spaceValidator(),
        CustomValidators.passwordValidation(),
      ]),
    });

    this.getUsers();

    google.accounts.id.initialize({
      client_id:
        '939910674326-4ng45jmorirmuuiu9irh80ofqdokl51l.apps.googleusercontent.com',
      callback: (res: any) => {
        this.ngZone.run(() => {
          this.googleLogin(res);
        });
      },
    });

    this.sizeObserver();
  }

  isUserRegistered: boolean = false;

  addUser(result: any) {
    let login: string = result.login.toString().replace(' ', '');
    let email: string = result.mail;
    let password: string = result.password;
    let avatar: string =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAwHpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBbEsMgCPznFD2CAjFwHNPYmd6gxy8KaWPTnXF5rLMi0F7PB9w6MDPwskrRUpKBlRWrJZIcdXBOPHigRbR66sNHQGuRRfJSStw/+l8DD9Wy5WQk9xC2WVAOf/kxQg/UJ+r5HkYaRoQu5DCo/q1UVNbzF7aWZogf6MQyj32pV9vevtg7hNgoUzImYh+A+iGgagIOFrvoOZMa+7qyL+Tfng7AG3BUWXPG00+oAAABhGlDQ1BJQ0MgcHJvZmlsZQAAeJx9kT1Iw0AcxV9TRdGKoB1EHIJWJ7uoiGOpYhEslLZCqw4ml35Bk4YkxcVRcC04+LFYdXBx1tXBVRAEP0BcXZwUXaTE/yWFFjEeHPfj3b3H3TtAqJeZanZEAFWzjGQsKmayq2LXKwIYQC9GMSYxU4+nFtPwHF/38PH1LsyzvM/9OfqUnMkAn0gcYbphEW8Qz25aOud94iArSgrxOfGkQRckfuS67PIb54LDAs8MGunkPHGQWCy0sdzGrGioxDPEIUXVKF/IuKxw3uKslquseU/+wkBOW0lxneYIYlhCHAmIkFFFCWVYCNOqkWIiSftRD/+w40+QSyZXCYwcC6hAheT4wf/gd7dmfnrKTQpEgc4X2/4YB7p2gUbNtr+PbbtxAvifgSut5a/UgblP0mstLXQE9G8DF9ctTd4DLneAoSddMiRH8tMU8nng/Yy+KQsM3gI9a25vzX2cPgBp6mr5Bjg4BCYKlL3u8e7u9t7+PdPs7wfOJ3LL1dgAsAAADXZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6MWZlZjI0YzgtYThhMy00MTM2LTljNjktYzI3MzJlMDBjNWUyIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmM3NjQ2MjdjLTExNTgtNGE5My1hMTEwLWZjYjYzNWZlYWJjYiIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmVmMjFiYjk1LTk4YzMtNDZmNi04ZDk5LWIwZTJjNWM3YTRiMCIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzAyOTAwMTQyMzIwNzE0IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzQiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzOjEyOjE4VDEyOjQ5OjAwKzAxOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyMzoxMjoxOFQxMjo0OTowMCswMTowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjcwY2ZjMGQ1LTVmN2UtNGQ5Mi1iMWU2LTQ4YjdiMDQxZjg0ZSIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChXaW5kb3dzKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMy0xMi0xOFQxMjo0OTowMiIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz6XyBSmAAAAflBMVEX///8AAAClpaX7+/vq6ur29vbk5OR8fHx5eXnExMTd3d2KiorV1dXR0dHx8fF0dHS0tLQbGxuWlpbIyMgwMDChoaFra2tRUVFmZmYmJiaPj4+EhIQ5OTm+vr6vr69bW1sODg4uLi5AQEA3NzchISFdXV1ISEgYGBhTU1NFRUWU4DVLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wwSCzEC3HN68AAABORJREFUeNrt3WtzojwUB3DDdIuiXTTlLgoConz/L/g8+2J3e1tLridh/udlx+n0V0IuJydxFS09VhBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBC+HXs+PqabdPTbonCM88S9jfKgp8XJHyumqRln6K/b58XIdxc2b9jvfNfGLPHEXouzAb2XZRrj4XnG5sT9cZXYcjmBvdTmM8GsrbxUTgykZj8E9aMuUE0JUyYaAx+CWsmHp1PwpHJxNUfYcHkYuuLkDPZCPwQbqSBrPdDmMgL2doHIW8VhGzvgbBTAbLEfWHK1II7LxwUhXfXhZypxslxYacsDB0XlspC9uS0UL2RMnZ2WphpEBZOCy8ahInLwhcNQHZwWXjWIWwDh4VHHULNy0S9wrsW4dFhYaJFGLsr/KEFyLLFC4vFC68QQoj3kHbt5PZoETVahKHDwnDxs7Zg8TPv18WvnrSsgC9OCwvnhkPdwkqDcO+0UDnl7Xw2UUNGWPcGm3NZ/XbvuPCnqlB7dZT2vSfVh+j+7ppUKc2bWszIfSF3aagwIlTqTuPIB6HC5LSOvBAqVGNwT4TRdelVX7JLjCLyRyjV24yRT0KJHYwk8ksonHbrIt+EglW098g/odC7GEc+CqP4NtM3bCNfhLudTH9z//A7dm4K0202Hhi7xcIp4vcPMPt/EVzmWZW6JYy74c9MbXhnPDWPMzdl8fLm08/Fn4bdlt1x54rwYyFU/b68cP0gNVq9+2RgYgdDXbi+fbu3kvZfT2KCx/+pXw0iJBeeD19n5j+U3+3SuBmT3589JGMRpx8OAfOv5wjJnlYYihVU8LC4xtVebD3CKYWPkvi1yCAXDsYyqErCbzZE67kNjB8MJolXGvvQz5HPqYYN+m9/T0UjnJWsmOLHx5jPRW84vSEvPM1OgVb/GrlfjnM3ckoKocguU7f9vHMdFCJLyMa+MBZc4Q59Ul66Kc/zaarrLhHdhqusC2/McrxYFua2gdLtVFIYWAdKl2isPGmj8oW1K3NDofbYWBQ2FEDJN3FldLDXHDtrwjWRcG1L+EQEZLktYUAlPNgSjlRCqSWGjPBCJhztCIOWTCjTm0oIt3RAlloRFoTCuxXhhVB4syHcEAJZu7EgTCmFEuPFyqvXUGbiJiz8SQqUqLkRFj7RCkfzwhOtsDQv5LRC8ctdVn51NBL3gggLR2JhZVw4EQtj48KeedaZCgsvxMLBuHAgFgofixIW3qiFz4aFVUstNN1KQ2ogezUsvJILT4aFd3Lh3rAwJxcGi3+G3LCwIRdWi2+lW8PCDkLjcTQsnBb/DK+L70vjxY+HnFy4MSxc/upJ02VXCnszxlfA1MOFcFpfWEg9bUuNCwNaoPgWqW87M415IWmhgkwxtMQ+/uDTWCElPPrUz8jVRNEl9mVK92SEeyqg1KUEUvWlRJPTllsT0ryKrdyhEsla/cqXJyh/oiSwPWaUsl97IX+yy+5qX/7uGoXzh8HBmq9W+HodpVOyfLKxWrzkSpfSqp5W55nZBWMXq14foeNOhdc9P2bNr7iP3ZuYpq7uy7K8lEn9+2d1n8yKfiqOfP+i4a+z+u3xJAEhhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEJoL/4Dmf0pTbgkTY8AAAAASUVORK5CYII=';

    this.checkIfLoginExist(login);
    this.checkIfEmailExist(email);

    if (this.registerForm.valid === true) {
      let newUser: User = {
        login: login.toLowerCase(),
        avatar_url: avatar,
        email: email,
        password: password,
        active: true,
        created: new Date(),
        role: 'user',
        untrusted: true,
        saved_notes: [],
        followed_users: [],
        blocked_users: [],
      };
      this.usersService.addUser(newUser).subscribe(
        (res) => {
          this.stopSizeObserver();

          this.isUserRegistered = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        },
        (error) => {}
      );
    } else
      alert(
        'Niestety nie spełniłeś warunków, potrzebnych do stworzenia konta!'
      );
  }

  getUsers() {
    this.usersService
      .getUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: User[]) => {
        this.usersOrigin = res;
      });
  }

  checkIfLoginExist(login: string) {
    this.usersOrigin.forEach((user) => {
      if (user.login.toLowerCase() === login.toLowerCase()) {
        this.registerForm.get('login')?.setErrors({ loginExist: true });
      }
    });
  }

  checkIfEmailExist(email: string) {
    this.usersOrigin.forEach((user) => {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        this.registerForm.get('mail')?.setErrors({ emailExist: true });
      }
    });
  }

  googleLogin(result: any) {
    let data = this.authService.googleToken(result.credential);
    this.isLoading = true;

    this.authService
      .loginGoogleUser(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (token) => {
          localStorage.setItem('Token', token);
          this.stopSizeObserver();
          this.isUserLogin();
        },
        (error) => {
          this.authService.currentUserSignal.set(null);
        }
      );
  }

  sizeObserver() {
    const container: any = document.querySelector('#container');

    this.observer = new ResizeObserver((entires) => {
      if (entires[0].borderBoxSize[0].inlineSize >= 900) {
        google.accounts.id.renderButton(
          document.getElementById('loginByPlatformG'),
          {
            type: 'standard',
            theme: 'outline',
            logo_alignment: 'center',
            shape: 'pill',
            width: 400,
          }
        );
      }

      if (
        entires[0].borderBoxSize[0].inlineSize <= 900 &&
        entires[0].borderBoxSize[0].inlineSize > 560
      ) {
        google.accounts.id.renderButton(
          document.getElementById('loginByPlatformG'),
          {
            type: 'standard',
            theme: 'outline',
            logo_alignment: 'center',
            shape: 'pill',
            width: 288,
          }
        );
      }

      if (entires[0].borderBoxSize[0].inlineSize <= 560) {
        google.accounts.id.renderButton(
          document.getElementById('loginByPlatformG'),
          {
            type: 'standard',
            theme: 'outline',
            logo_alignment: 'center',
            shape: 'pill',
            width: 224,
          }
        );
      }
    });

    this.observer.observe(container);
  }

  stopSizeObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  isUserLogin() {
    this.authService
      .isUserLogin()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.isLoading = false;
        this.authService.currentUserSignal.set(result);
        this.router.navigateByUrl('/notes');
      });
  }
}
