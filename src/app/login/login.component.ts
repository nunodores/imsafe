import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { User } from '../../models/interfaces';
import { Router } from '@angular/router';
import { UserApiService } from 'src/service/userApi.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  user: User;
  submitted: boolean;
  
  constructor(private apiService: UserApiService,  
      private router : Router, 
      private formBuilder : FormBuilder) { }

  ngOnInit() {
      this.submitted = false;
      this.loginForm = this.formBuilder.group({
          login: new FormControl('', [Validators.required, Validators.maxLength(50)]),
          password: new FormControl('', [Validators.required, Validators.maxLength(50)])
      })
  }

  public login = () => {
    this.submitted = true;
    if(this.loginForm.valid) {
      this.user = {
          login: this.loginForm.controls.login.value,
          password: this.loginForm.controls.password.value
      }
      this.apiService.login(this.user.login, this.user.password)
          .subscribe(data => {
              if(data != null){
                  this.router.navigate(["/alertDetails"]); 
              }
          })
    }
  }
  
  public hasError = (controlName: string, errorName: string) => {
      return this.loginForm.controls[controlName].hasError(errorName);
  }

}
