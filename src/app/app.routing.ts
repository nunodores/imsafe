import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AlertDetailsComponent } from './alert-details/alert-details.component';
import { AuthService } from '../service/auth.service'
import { AlertComponent } from './alert/alert.component';

const routes: Routes =[
    { path: 'home',             component: HomeComponent },
    { path: 'user-profile',     component: ProfileComponent, canActivate: [AuthService] },
    { path: 'register',           component: SignupComponent },
    { path: 'landing',          component: LandingComponent, canActivate: [AuthService] },
    { path: 'login',          component: LoginComponent },
    { path: 'logout',          component: LogoutComponent, canActivate: [AuthService] },
    { path: 'alertDetails',   component: AlertDetailsComponent, canActivate: [AuthService] },
    { path: 'alert',          component: AlertComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
