import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../servicios/users.service';

@Injectable({
  providedIn: 'root'
})
export class InicioSessionGuard implements CanActivate {

  constructor(private auth: UsersService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(this.auth.getToken() ==''){
      window.location.href = '/';
    }
    return true;
  }
  
}
