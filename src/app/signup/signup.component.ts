import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { User } from '../../models/interfaces';
import { Router } from '@angular/router';
import { UserApiService } from 'src/service/userApi.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
    
    signupForm: FormGroup;
    user: User;
    submitted: boolean;
    
    constructor(private apiService: UserApiService,  
        private router : Router, 
        private formBuilder : FormBuilder) { }

    ngOnInit() {
        this.submitted = false;
        this.signupForm = this.formBuilder.group({
            login: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            email: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            uuid: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            password: new FormControl('', [Validators.required, Validators.maxLength(50)])
        })
    }

    public register = () => {
        this.submitted = true;
        if(this.signupForm.valid) {
            this.user = {
                login: this.signupForm.controls.login.value,
                firstName: this.signupForm.controls.firstName.value,
                lastName: this.signupForm.controls.lastName.value,
                email: this.signupForm.controls.email.value,
                uuid: this.signupForm.controls.uuid.value,
                password: this.signupForm.controls.password.value
            }
            this.apiService.register(this.user)
                .subscribe(data => {
                    if(data != null){
                        this.router.navigate(["/alertDetails"]); 
                    }
                })
        }
    }
    
    public hasError = (controlName: string, errorName: string) => {
        return this.signupForm.controls[controlName].hasError(errorName);
    }
}
