import { Component, HostListener, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { NavService  } from 'src/app/servicios/_nav.service';
import { INavData } from '@coreui/angular';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']  
  
})
export class DefaultLayoutComponent {
  
  token            : string ;
  parametros       : any[]      = [];  
  modulos          : any        = [];
  menu             : any;
  navItems : INavData[] ;
  avatar           :string      = '';           
  name             :string      = '';
  rol              :string      = '';
  logo             :string      = '';
  empresa          :string      = '';
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
   constructor(  private rest           : RestService ,
                 private servicioUser   : UsersService,
                 private servicioNav    : NavService,
                 private servicioAlerta : AlertasService) {
                  
                  this.navItems  = this.servicioNav.navItems;
                  this.token     = servicioUser.getToken();
                  this.avatar    = this.servicioUser.getUser().img;
                  this.name      = this.servicioUser.getUser().usuario;
                  this.name      = this.servicioUser.getUser().usuario;
                  this.rol       = this.servicioUser.getUser().rol;
                  this.logo      = this.servicioUser.getUser().imgEmp;
                  this.empresa   = this.servicioUser.getUser().empresa;
                  this.menu      = this.servicioUser.getUser().menu;
                  
                 
                  if(this.avatar == ''){
                    this.avatar = this.name.substring(0,2);
                  }
               
               
  
  
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
    });

    this.servicioUser.disparador.subscribe(next =>{
        this.avatar = next;
        this.servicioUser.setUsuario(this.name, this.rol, this.menu, this.avatar, this.empresa, this.logo);  
    })
  
  }

  
}
