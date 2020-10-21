import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Assessment } from '../models/interfaces'

@Injectable({
  providedIn: 'root'
})

export class AssessmentApiService {
  baseUri:string = 'http://resastyle.com:9000/';
  //baseUri:string = 'http://localhost:9000/';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Create Assessments
  createAssessment(data): Observable<any> {
    let url = `${this.baseUri}assessments/`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get an Assessment by the alert id
  getAssessmentByAlertId(id: string): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUri}assessments/${id}`, { headers: this.headers }).pipe(
        catchError(this.errorMgmt)
      );
  }

  // Update Assessments
  updateAssessment(id, data): Observable<any> {
    let url = `${this.baseUri}assessments/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete Assessments
  deleteAssessment(id): Observable<any> {
    let url = `${this.baseUri}assessments/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
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