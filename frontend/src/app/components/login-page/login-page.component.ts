import { Component, OnInit } from '@angular/core';
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

  constructor(private authService: AuthService, private router: Router) {
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
        CustomValidators.spaceValidator(),
        CustomValidators.specialCharactersValidator(),
      ]),
      password: new FormControl('', [
        Validators.required,
        CustomValidators.spaceValidator(),
        CustomValidators.passwordValidation(),
      ]),
    });

    //google client_id- 939910674326-4ng45jmorirmuuiu9irh80ofqdokl51l.apps.googleusercontent.com

    google.accounts.id.initialize({
      client_id:
        '939910674326-4ng45jmorirmuuiu9irh80ofqdokl51l.apps.googleusercontent.com',
      callback: (res: any) => {
        console.log(res.credential);
        console.log('dane: ', this.authService.decodeToken(res.credential));
      },
    });

    google.accounts.id.renderButton(
      document.getElementById('loginByPlatformG'),
      {
        type: 'standard',
        theme: 'outline',
        shape: 'pill',
        width: 250,
      }
    );
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
            // setTimeout(() => {
            //   this.router.navigateByUrl('/notes');
            // }, 35000);
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
