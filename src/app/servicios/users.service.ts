
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root"
})
export class UsersService {

  constructor(private http: HttpClient , private cookies: CookieService ) {}

  login(user: any): Observable<any> {
     const headers = { 'Content-Type': 'application/json' };
     let xuser ={'Authentication':btoa(JSON.stringify(user))};
     return this.http.post('log', xuser, { headers });
  }

  setToken(token: string) { 
    localStorage.setItem('token', token);   
  }

  getToken() : string{
   // return this.cookies.get("token");
   let datos = localStorage.getItem('token');

     if (!datos) {
       datos = '';
     }
     return datos;
  }

  eliminarToken () {
    localStorage.clear();
  }


  setTokenCrf(token: string) { 
    localStorage.setItem('crf', token);   
  }

  getTokenCrf() : string{
   // return this.cookies.get("token");
   let datos = localStorage.getItem('crf');

     if (!datos) {
       datos = '';
     }
     return datos;
  }


}
