import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { CustomValidators } from 'src/app/helpers/custom-validators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Login } from 'src/app/models/login.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent extends Unsubscribe implements OnInit {
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    super();
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

            setTimeout(() => {
              this.router.navigateByUrl('/notes');
            }, 1000);
          } else {
            console.log('Błędny login lub hasło');
            this.loginForm
              .get('password')
              ?.setErrors({ wrongLoginOrPassword: true });
          }
        });
    }
  }
}
