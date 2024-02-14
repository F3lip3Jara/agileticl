import { Component } from '@angular/core';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { INavData } from '@coreui/angular';
import Echo from 'laravel-echo';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {


  token            : string ;
  parametros       : any[]      = [];  
  modulos          : any        = [];
  public navItems  : INavData[] = []; 
  menu             : any        = {};


  constructor(  private rest        : RestService ,
                private servicioUser: UsersService) {

                  this.token    = servicioUser.getToken();                
                  this.menu     = this.servicioUser.getUser().menu;
               
                  this.menu.forEach((element:any) => {
                    let icono             ={};
                    let module : INavData = 
                    {
                      title: true,
                      name: element.molDes
                    };   
                    
                    icono    = { name: element.molIcon };

                    this.navItems.push(module);                   
              
                    let opciones  = element.opciones;
              
                    opciones.forEach((opt : any) => {
                      let opcion : INavData = 
                      {
                          name: opt.optDes,
                          url:  opt.optLink,
                          iconComponent: icono,
                      };
                      this.navItems.push(opcion);                
                    });
                  
                  });

  }

  ngOnInit(): void {

   
  }

}
