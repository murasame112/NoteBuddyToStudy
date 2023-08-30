import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { CustomValidators } from 'src/app/helpers/custom-validators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  loginForm!:FormGroup

  ngOnInit(): void {
    this.loginForm = new FormGroup(
     {
       login: new FormControl('',[Validators.required,CustomValidators.spaceValidator(),CustomValidators.specialCharactersValidator()]),
       password: new FormControl('',[Validators.required,CustomValidators.spaceValidator(),CustomValidators.passwordValidation()]),

     }
   )
 }
}
