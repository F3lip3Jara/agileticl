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
  parametros       : any[]     = [];  
  modulos          : any       = [];
  navItems1        : INavData[]= []; 
  public navItems  : INavData[]= []; 



  constructor(  private rest        : RestService ,
                private servicioUser: UsersService) {

                  this.token    = servicioUser.getToken(); 
                  
                  this.rest.get('usuarioMenu', this.token,this.parametros).subscribe((respuesta:any) =>{
                    this.modulos = respuesta;                  
                 //   console.log(this.modulos);
                    this.modulos.forEach((element : any) => {
                      let opciones = element.opciones;
                      let icono ={};

                      if(element.menu.idMol == 2){
                         icono    = { name: 'cil-cog'}
                      }else{
                         icono    = { name: element.menu.molIcon }
                      }                      
                      let module : INavData = 
                    {
                      title: true,
                      name: element.menu.molDes
                    };

                    this.navItems1.push(module);                   
                  
                    opciones.forEach((opt:any) => {
                      let childrens : any[] =[] ; 
                      
                      if(opt.optSub == 'S'){
                        let subopt = opt.sub;

                        subopt.forEach((optsub : any) => {
                          let chil =   {
                            name: optsub.optSDes,
                            url: optsub.optSLink
                          };

                          childrens.push(chil)
                        });

                 
                      }else{
                        childrens  = [] ; 
                      }

                      let opcion : INavData = 
                      {
                      name: opt.optDes,
                      url:  opt.optLink,
                      iconComponent: icono,
                      children: childrens
                      };

                      this.navItems1.push(opcion);
                    });          

            });             
            
            this.navItems = this.navItems1;
      });     

  }

  ngOnInit(): void {

    
  }

}
