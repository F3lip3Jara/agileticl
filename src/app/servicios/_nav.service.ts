import { Injectable} from '@angular/core';
import { UsersService } from './users.service';
import { INavData } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';

@Injectable({
  providedIn: 'root'
})


export class NavService {
    navItems: INavData[] = [];
    menu    : any;

  constructor( private servicioUser: UsersService ){
         this.menu      = this.servicioUser.getUser().menu;

         let icono             = {};
   

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
  }

}
