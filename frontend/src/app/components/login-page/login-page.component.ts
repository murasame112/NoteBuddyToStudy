import { Component, NgZone, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { skipWhile, take, takeUntil } from 'rxjs';
import { CustomValidators } from 'src/app/helpers/custom-validators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Login } from 'src/app/models/login.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
declare let google: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent extends Unsubscribe implements OnInit {
  loginForm!: FormGroup;
  observer: any;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      login: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        CustomValidators.lowercaseValidator(),
        CustomValidators.spaceValidator(),
        CustomValidators.specialCharactersValidator(),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        CustomValidators.spaceValidator(),
        CustomValidators.passwordValidation(),
      ]),
    });

    google.accounts.id.initialize({
      client_id:
        '939910674326-4ng45jmorirmuuiu9irh80ofqdokl51l.apps.googleusercontent.com',
      callback: (res: any) => {
        this.ngZone.run(() => {
          this.googleLogin(res);
        });
      },
    });

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

    this.sizeObserver();
  }

  login(data: Login) {
    let login: Login = {
      login: data.login,
      password: data.password,
    };

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService
        .loginUser(login)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result: any) => {
          if (result != 'false') {
            localStorage.setItem('Token', result);
            this.stopSizeObserver();
            this.isUserLogin();
          } else {
            this.authService.currentUserSignal.set(null);

            this.loginForm
              .get('password')
              ?.setErrors({ wrongLoginOrPassword: true });
          }
        });
    }
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
