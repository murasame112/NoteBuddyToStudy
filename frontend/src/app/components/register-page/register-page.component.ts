import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent extends Unsubscribe implements OnInit {
  public registerForm!: FormGroup;
  usersOrigin: User[] = [];

  constructor(private usersService: UsersService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      login: new FormControl('', [
        Validators.required,
        CustomValidators.spaceValidator(),
        CustomValidators.specialCharactersValidator(),
      ]),
      mail: new FormControl('', [
        Validators.required,
        Validators.email,
        CustomValidators.spaceValidator(),
      ]),
      password: new FormControl('', [
        Validators.required,
        CustomValidators.spaceValidator(),
        CustomValidators.passwordValidation(),
      ]),
    });

    this.getUsers();
  }

  isUserRegistered: boolean = false;

  addUser(result: any) {
    // console.log(result);
    // console.log(this.registerForm.valid);
    // console.log(this.registerForm);
    let login: string = result.login.toString().replace(' ', '');
    let email: string = result.mail;
    let password: string = result.password;
    // console.warn(`login: ${login}, email: ${email}, hasło: ${password}`)

    this.checkIfLoginExist(login);
    this.checkIfEmailExist(email);

    if (this.registerForm.valid === true) {
      let newUser: User = {
        login: login.toLowerCase(),
        avatar_url: 'random_url',
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
          this.isUserRegistered = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        },
        (error) => {
          console.log(error);
        }
      );
      // console.log(newUser);
    } else
      console.log(
        'Niestety nie spełniłeś warunków, potrzebnych do stworzenia konta!'
      );
  }

  register() {}

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
}
