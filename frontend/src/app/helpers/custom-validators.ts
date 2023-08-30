import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';



export class CustomValidators {


 static spaceValidator(): ValidatorFn
  {
    return (control: AbstractControl):  ValidationErrors | null => {

      if(control.value != null && control.value.indexOf(" ") != -1)
      {
        return {spaceValidator: true};
      }
      return null;

    }
  }


 static specialCharactersValidator(): ValidatorFn
  {
    const regex =new RegExp (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);


    return (control:AbstractControl): ValidationErrors | null =>{

      const isValid = regex.test(control.value)

      if(isValid)
      {
        return {loginSpecialCharacterError:true}
      }
      return null

    }
  }


 static passwordValidation():ValidatorFn
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
