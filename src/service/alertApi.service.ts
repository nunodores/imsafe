import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Alert } from '../models/interfaces'

@Injectable({
  providedIn: 'root'
})

export class AlertApiService {
  baseUri:string = 'http://resastyle.com:9000/';
  //baseUri:string = 'http://vps-d4f37b99.vps.ovh.net:9000/';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Create Alerts
  createAlert(data): Observable<any> {
    let url = `${this.baseUri}alerts/`;
    return this.http.post(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all Alerts
  getAlerts() {
    return this.http.get(`${this.baseUri}alerts/`, { headers: this.headers });
  }

  // Update Alerts
  updateAlert(id, data): Observable<any> {
    let url = `${this.baseUri}alerts/${id}`;
    return this.http.put(url, data, {headers: this.headers}).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete Alerts
  deleteAlert(id): Observable<any> {
    let url = `${this.baseUri}alerts/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // get an array of alerts by id
  getAlertsFromSpecificUser(id: string): Observable<Alert[]> {
      let url = `${this.baseUri}alerts/user_alerts/${id}`;
      return this.http.get<Alert[]>(url);
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