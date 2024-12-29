
import { EventEmitter, Injectable, Output } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { INavData } from "@coreui/angular";


@Injectable({
  providedIn: "root"
})
export class UsersService {

  @Output() disparador  :EventEmitter <any> = new EventEmitter();   
  modulo  : any        = [];
  navItems: INavData[] = [];
  menu    : any        = [];


  constructor(private http: HttpClient , private cookies: CookieService ) {}

  login(user: any): Observable<any> {
     const headers = { 'Content-Type': 'application/json' };
     let xuser ={'Authentication':btoa(JSON.stringify(user))};
     return this.http.post('log', xuser, { headers });
  }

  setToken(token: string ) { 
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.setUsuario('','','','','','');
    this.navItems = [];
    this.menu     = [];
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

  setUsuario(usuario : string , rol : string , menu:string , img:string , empresa:string , imgEmp:string ){
    let user = {usuario : usuario , rol : rol , menu : menu, img:img , empresa: empresa , imgEmp : imgEmp};
    localStorage.setItem('user',btoa(JSON.stringify(user)));
   }

  getUser() :any{
    let datos = localStorage.getItem('user'); 
    if (!datos) {
      datos = '';
    }
    let datox  = JSON.parse(atob(datos));
    return datox;    

   }


   getNavItem(){
    let icono      = {};
    let dato = this.getUser();
    this.menu = [];
    this.menu = dato.menu;
    
    
    this.menu.forEach((element:any) => {
       let icono             = {}; 
       let module : INavData = 
           {
           title: true,
           name: element.molDes
           }; 
       
       icono    = { name: element.molIcon };
       this.navItems.push(module);    
        
       let opciones  = element.opciones;
        
       opciones.forEach((opt : any) => {
           if(opt.optSub === 'S'){ 
            let opcion : INavData = 
            {
              name: opt.optDes,
              url:  opt.optLink,
              iconComponent: icono,
              children :opt.childrens
            };
            this.navItems.push(opcion);
          }else{
            let opcion : INavData = 
            {
              name: opt.optDes,
              url:  opt.optLink,
              iconComponent: icono,
            };
           
            this.navItems.push(opcion);
          }                
        });
    });
    return this.navItems;
   }

   
  

}
