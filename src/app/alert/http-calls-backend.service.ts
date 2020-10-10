import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpCallsBackendService {

  constructor(private http: HttpClient) { }
  httpDefault = "http://localhost:9000/"

  postAlert(body){
    console.log("Before call")
    this.http.post<any>(this.httpDefault+"alerts", body).subscribe(data => {
      
    });
  } 
 
}
