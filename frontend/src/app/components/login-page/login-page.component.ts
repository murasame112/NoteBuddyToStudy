import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { CustomValidators } from 'src/app/helpers/custom-validators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Login } from 'src/app/models/login.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent extends Unsubscribe implements OnInit {
  loginForm!: FormGroup;

  constructor(private usersService: UsersService) {
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

    let login: any = {
      email: data.login,
      password: data.password,
    };

    if (this.loginForm.valid) {
      console.log('logujemy');
    } else {
      console.log('nie logujemy');
    }

    // console.log(login);
    // this.usersService
    //   .loginUser(login)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((result: any) => {
    //     console.log('login result:', result);
    //   });
  }
}
