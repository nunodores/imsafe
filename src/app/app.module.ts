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
import { LogoutComponent } from './logout/logout.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PushNotificationService } from 'src/service/pushNotification.service';
import { environment } from 'src/environments/environment';
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { AsyncPipe } from "../../node_modules/@angular/common";
import { MessagingService } from 'src/service/messaging.service';


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
    AlertDetailsComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,   
    ReactiveFormsModule,
    RouterModule,
    GoogleChartsModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),    HttpClientModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
      AngularFireAuthModule,
      AngularFireMessagingModule,
      AngularFireModule.initializeApp(environment.firebase),
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
  providers: [HttpClientModule,PushNotificationService,MessagingService,AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
