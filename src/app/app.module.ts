import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';

import { AlertComponent } from './alert/alert.component';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { VoiceRecognitionComponent } from './voice-recognition/voice-recognition.component';
import { AlertDetailsComponent } from './alert-details/alert-details.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { HttpClientModule, HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';



@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    AlertComponent,
    VoiceRecognitionComponent,
    AlertDetailsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,   
    ReactiveFormsModule,
    RouterModule,
    GoogleChartsModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
             return     localStorage.getItem('access_token');}
      }
    }),
    AppRoutingModule,
    HomeModule,
    HttpClientModule,
    HttpModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
