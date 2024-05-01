import { Component, HostListener } from '@angular/core';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { INavData } from '@coreui/angular';
import Echo from 'laravel-echo';
import { AlertasService } from 'src/app/servicios/alertas.service';

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
  usrimg           :string      = '';           
  usrname          :string      = '';
  rol              :string      = '';
  logo             :string      = '';
  isLoading        :boolean     = false;
  altura           :number      = 0;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement; // Convertir a HTMLElement para acceder a las propiedades específicas del elemento
    // Verificar si el objetivo del clic es un botón
    if (target.tagName === 'BUTTON') {
      const audio = new Audio('assets/button.mp3');
      audio.play();
    }
    // Verificar si el objetivo del clic es un enlace (a)
    if (target.tagName === 'A') {
      const audio = new Audio('assets/button.mp3');
      audio.play();
    }
  }
   constructor(  private rest        : RestService ,
                 private servicioUser: UsersService,
                 private servicioAlerta : AlertasService) {

                  this.token    = servicioUser.getToken();                
                  this.menu     = this.servicioUser.getUser().menu;
                  this.usrimg   = this.servicioUser.getUser().img;
                  this.usrname  = this.servicioUser.getUser().usuario;
                  this.rol      = this.servicioUser.getUser().rol;
                  this.logo     = this.servicioUser.getUser().imgEmp;
                 
                  if(this.usrimg == ''){
                    this.usrimg = this.usrname.substring(0,2);
                  }
               
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
                     if(opt.optSub === 'S'){
                      
                      let opcion : INavData = 
                      {
                        name: opt.optDes,
                        url:  opt.optLink,
                        iconComponent: icono,
                        children: opt.childrens
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

  ngOnInit(): void {
    this.servicioAlerta.loading.subscribe(data=>{         
      let xaltura     = 0;
      this.altura     = 10;
      
      const xelemento = document.getElementsByTagName('body')[0];
      if (xelemento instanceof HTMLElement) {
        xaltura  = xelemento.offsetHeight; 
      }
      this.isLoading  = data; 

      if(this.isLoading ){        
        this.altura  = this.altura + xaltura;
      }
    
  })
   
  }

 

}
