import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  constructor(private usersService: UsersService) {}



  ngOnInit(): void {

  }



  // registerForm!:FormGroup


  registerForm = new FormGroup(
    {
      login: new FormControl('',[Validators.required,this.spaceValidator()]),
      mail: new FormControl('',[Validators.required, Validators.email,this.spaceValidator()]),
      password: new FormControl('',[Validators.required,this.spaceValidator(),this.passwordValidation()]),

    }
  )


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
console.log('Niestety nie spełniłeś warunków, aby zostać nowym użytkownikiem!');


  }

  //No space allowed to be in this expression
  // spaceValidator(control: FormControl)
  // {

  //   if(control.value != null && control.value.indexOf(' ') != -1)
  //   {
  //     return {spaceValidator: true}
  //   }
  //   return null;

  // }

  spaceValidator(): ValidatorFn
  {
    return (control: AbstractControl):  ValidationErrors | null => {

      if(control.value != null && control.value.indexOf(" ") != -1)
      {
        return {spaceValidator: true};
      }
      return null;

    }
  }

  passwordValidation():ValidatorFn
  {

    const regex =new RegExp (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/);


    return (control:AbstractControl): ValidationErrors | null =>{

      const isValid = regex.test(control.value)

      if(!isValid)
      {
        return {passwordInvalid:true}
      }
      return null

    }



  }




}
