import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/interfaces'

@Injectable({
    providedIn: 'root'
})

export class UserApiService {
    //baseUri:string = 'http://resastyle.com:9000/';
    baseUri: string = 'http://localhost:9000/';
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post<{token: string}>('http://localhost:9000/users/register/', user).pipe(tap(res => {
            this.login(user.login, user.password)
        }))
    }

    login(login: string, password: string) {
        return this.http.post<{ token: string, _id: string }>('http://localhost:9000/users/login/', { login, password }).pipe(tap(res => {
            localStorage.setItem('access_token', res.token);
            localStorage.setItem('_id', res._id);
        }))
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('_id');
      }

      public get loggedIn(): boolean{
        return localStorage.getItem('access_token') !==  null;
      }

    

    // Error handling 
    errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

}