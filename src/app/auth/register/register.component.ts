import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
 registerForm!: FormGroup;
  validator = {
  passwordPattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$!%*.#?&]{8,}$/,
  };
  constructor(private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private helperService:HelperService,
    private toastr: ToastrService,
    private authService:AuthService) { }

  readonly createUserValidationMessages: any = {
    password: [
      { type: 'required', message: 'password is required' },
      { type: 'pattern', message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and minimum eight characters' },
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter valid Email' },
    ],
    name: [
      { type: 'required', message: 'Name is required' }
    ],
    confirmPassword: [
      { type: 'required', message: 'Confirm Password is required' },
      { type: 'mustMatch', message: 'Password does not match' },
    ],
  };

  ngOnInit(): void {
    this.initializeRegisterForm();
  }
  
  initializeRegisterForm(){
    this.registerForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', Validators.compose([Validators.required,
          Validators.pattern(
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'
          )])],
        password: ['',[
          Validators.required,
          Validators.pattern(this.validator.passwordPattern),
        ]],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: this.MustMatch('password', 'confirmPassword'),
      }
    );
  }

  register(){
    this.spinner.show();
    this.authService.createUser(this.registerForm.value).subscribe(
      (resp: any) => {
        console.log(resp,'ressss')
        if(resp.code == 200){
          this.helperService.sendMesg({ authenticate: true, user: resp.data.user });
          localStorage.setItem('user',JSON.stringify(resp.data.user));
          localStorage.setItem('token',resp.data.token);
          this.router.navigate(['/home']);
          this.spinner.hide();
          this.toastr.success('Register Successful', '');
        }else{
          this.spinner.hide();
          this.toastr.error(resp.message, '');
        }
        
      },
      (e: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastr.error(e.error.message, '');
      });

  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
}
