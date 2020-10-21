import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/interfaces'

@Injectable({
    providedIn: 'root'
})

export class UserApiService {
    baseUri:string = 'http://resastyle.com:9000/';
    //baseUri: string = 'http://localhost:9000/';
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post<{token: string}>(`${this.baseUri}users/register/`, user, { headers: this.headers }).pipe(tap(res => {
            this.login(user.login, user.password)
        }))
    }

    login(login: string, password: string) {
        return this.http.post<{ token: string, _id: string }>(`${this.baseUri}users/login/`, { login, password }, { headers: this.headers }).pipe(tap(res => {
            localStorage.setItem('access_token', res.token);
            localStorage.setItem('login', login);
        }))
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('login');
      }

      public get loggedIn(): boolean{
        return localStorage.getItem('access_token') !==  null;
      }

    
    // get a user by login
    getUser(login: string): Observable<User> {
        let url = `${this.baseUri}users/${login}`;
        return this.http.get<User>(url, { headers: this.headers });
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