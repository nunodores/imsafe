import { Component, OnInit } from '@angular/core';
import { UserApiService } from 'src/service/userApi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private apiService: UserApiService,  
    private router : Router) { }

  ngOnInit(): void {
    this.apiService.logout();
    this.router.navigate(["/login"]); 
  }

}
