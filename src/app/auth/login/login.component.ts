import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { HelperService } from '../../services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private helperService:HelperService,
    private toastr: ToastrService,
    private router: Router,
    private authService:AuthService) { }

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  readonly loginUserValidationMessages: any = {
    password: [
      { type: 'required', message: 'password is required' },
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter valid Email' },
    ],

  };

  initializeLoginForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required,
        Validators.pattern(
          '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'
        )])],
      password: ['', [Validators.required]],
    });
  }
  
  login(){
    this.spinner.show();
    this.authService.login(this.loginForm.value).subscribe(
      (resp: any) => {
        console.log(resp,'ressss')
        if(resp.code == 200){
          this.helperService.sendMesg({ authenticate: true, user: resp.data.user });
          localStorage.setItem('user',JSON.stringify(resp.data.user));
          localStorage.setItem('token',resp.data.token);
          this.router.navigate(['/home']);
          this.spinner.hide();
          this.toastr.success('Login Successful', '');
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
}
