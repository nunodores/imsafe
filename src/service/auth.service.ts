import { Injectable } from '@angular/core';      
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';      
import { Observable } from 'rxjs';   
   
@Injectable({      
   providedIn: 'root'      
})      
export class AuthService implements CanActivate {      
   constructor(private router: Router) { }      
   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {     
    if (this.isLoggedIn()) {
        return true;
    }      
    // navigate to login page as user is not authenticated      
   this.router.navigate(['/login']);
   return false;      
}
public isLoggedIn(): boolean {
   return localStorage.getItem('access_token') !== null;      
   }    
} 