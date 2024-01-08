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

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    super();

    // toObservable(this.authService.currentUserSignal)
    //   .pipe(
    //     skipWhile((status) => status === undefined),
    //     take(10)
    //   )
    //   .subscribe((res) => {
    //     console.log('Sygnał BZZ:', res);
    //   });
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

    //google client_id- 939910674326-4ng45jmorirmuuiu9irh80ofqdokl51l.apps.googleusercontent.com

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

    // console.log(document.getElementsByClassName('loginGoogle'));
    // console.log(document.querySelector('.loginGoogle'));
    // console.log(document.getElementById('loginByPlatformG'));

    this.sizeObserver();
  }

  login(data: Login) {
    console.log(`login: ${data.login} hasło: ${data.password}`);

    let login: Login = {
      login: data.login,
      password: data.password,
    };

    if (this.loginForm.valid) {
      console.log(login);
      this.authService
        .loginUser(login)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result: any) => {
          if (result != 'false') {
            console.log('login result:', result);
            localStorage.setItem('Token', result);
            //!
            this.isUserLogin();
            //!
          } else {
            this.authService.currentUserSignal.set(null);

            console.log('Błędny login lub hasło');
            console.log('login fail result:', result);
            this.loginForm
              .get('password')
              ?.setErrors({ wrongLoginOrPassword: true });
          }
        });
    }
  }

  googleLogin(result: any) {
    // console.log('dane: ', this.authService.googleToken(res.credential));
    let data = this.authService.googleToken(result.credential);

    console.log(data);
    this.authService
      .loginGoogleUser(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (token) => {
          console.log(token);
          localStorage.setItem('Token', token);
          this.stopSizeObserver();
          this.isUserLogin();
        },
        (error) => {
          console.log(error);
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
        console.log('Sprawdzanie /extract', result);
        this.authService.currentUserSignal.set(result);
        this.router.navigateByUrl('/notes');
      });
  }
}
