import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import {CustomValidators} from 'src/app/helpers/custom-validators'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

 public registerForm!:FormGroup

  constructor(private usersService: UsersService, private router: Router) {}



  ngOnInit(): void {
     this.registerForm = new FormGroup(
      {
        login: new FormControl('',[Validators.required,CustomValidators.spaceValidator(),CustomValidators.specialCharactersValidator()]),
        mail: new FormControl('',[Validators.required, Validators.email,CustomValidators.spaceValidator()]),
        password: new FormControl('',[Validators.required,CustomValidators.spaceValidator(),CustomValidators.passwordValidation()]),

      }
    )
  }


  // registerForm!:FormGroup
  isUserRegistered:boolean = false;




  addUser(result:any)
  {
    console.log(result)
    console.log(this.registerForm.valid)
    console.log(this.registerForm)
    let login:string = result.login.toString().replace(" ","");
    let email:string = result.mail;
    let password:string = result.password;
    // console.warn(`login: ${login}, email: ${email}, hasło: ${password}`)

if(this.registerForm.valid===true)
{

  let newUser: User =
    {
      name: login,
      avatar_url: "random_url",
      login: login,
      password: password,
      active: true,
      created: new Date(),
      role: "user",
      untrusted: false,
      saved_notes: [],
      followed_users: [],
      blocked_users: [],
      notifications: []

    }



    this.usersService.addUser(newUser).subscribe(
      (res)=>{
        if(res.status ===201)
        {
          let id:string = res.body;
          console.log(`Dodano użytkownika o id: ${id} `)

        }else if(res.status === 400)
        {
          console.log(res,"status 400");


        }else if(res.status === 200)
        {
          console.log(res,"status 200");

        }else
        {
          console.log("problem")
        }

      },
      (error)=>{
        console.log(error)
      })

    console.log(newUser)
}else
console.log('Niestety nie spełniłeś warunków, potrzebnych do stworzenia konta!');

this.register();
  }


  register()
  {
    if(this.registerForm.valid)
    {
      this.isUserRegistered = true;

      setTimeout(()=>{
        this.router.navigate(['/login']);
      },5000);

    }
  }


}
