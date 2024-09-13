import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { faArrowTurnDown, faArrowUp, faStar } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ReceptorDirective } from 'src/app/servicios/receptor.directive';
import { InsMolOptComponent } from './ins-mol-opt/ins-mol-opt.component';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { InsMolRolComponent } from './ins-mol-rol/ins-mol-rol.component';


@Component({
  selector: 'app-ins-modulo-opt',
  templateUrl: './ins-modulo-opt.component.html',
  styleUrls: ['./ins-modulo-opt.component.scss']
})
export class InsModuloOptComponent {

  token           : string  = '';
  parametros      : any     = [];
  val             : boolean = false;
  mensaje         : string  = '';
  faArrowTurnDown           = faArrowTurnDown;
  modulo          : any     = {};
  optAsig         : any     = [];
  optnAsig        : any     = [];
  faStar                    = faStar;
  faArrowUp                 = faArrowUp;
  ins             : FormGroup;
  icon            : string  = '';
  rolSnAsig       : any     = [];
  rolAsig         : any     = [];
  
  items: MenuItem[] | undefined;
  activeIndex: number       = 0;
  active: number            = 0;

  @ViewChild(ReceptorDirective, { static: true }) receptor?: ReceptorDirective;

  constructor( private servicio     : UsersService,
               private rest         : RestService,             
               private serviLoad    : LoadingService,
               fgIns                : FormBuilder,
               private componentFactoryResolver: ComponentFactoryResolver,
              private moduloser       :ModuloService){
              
                this.token = this.servicio.getToken();

                this.ins = fgIns.group({
                  molDes : ['' , Validators.compose([
                    Validators.required,
                   ])]
                  
                });
              
              }

  ngOnInit(){
    this.rest.get('snAsig', this.token,this.parametros).subscribe(data => {
      this.moduloser.clear();     
      this.optnAsig = data;

      this.rest.get('snAsigRol', this.token,this.parametros).subscribe(data => {
        this.rolSnAsig = data;
        this.moduloser.setRolnAsig(this.rolSnAsig);
        this.moduloser.setOptnAsig(this.optnAsig);
        this.links(InsMolOptComponent);
      });
     
      
    });
    
    this.items = [
      {
          label: 'Opciones'
      },
      {
          label: 'Roles'
      }
    ];
    this.moduloser.disparador.subscribe((data:any) =>{
      if(data.tipo ==='O'){
          if(data.parm.length === 0){            
            console.log("error sin opciones");       
            this.optAsig = data.parm;      
          }else{         
            this.optAsig = data.parm;
            console.log(this.optAsig); 
          }
      }else{
        if(data.parm.length === 0){            
          console.log("error sin roles"); 
          this.rolAsig = data.parm;   
        }else{
          this.rolAsig = data.parm;
          console.log(this.rolAsig); 
        }
      }
      
    })
   
  }

 
  guardar( molDes: any ){
    this.parametros   = {molId: this.modulo.molId , opt:this.optAsig , molDes: molDes , molIcon : this.icon , ok:'S' , roles:this.rolAsig};
    this.val          = true;
    this.serviLoad.sumar.emit(1);
    this.rest.post('insModulo', this.token, this.parametros).subscribe(resp => {
        this.val = false;
    });
  
  }

  icono(icono :any){
      this.icon = icono;
      
  }

  onActiveIndexChange(event: number) {
   
    this.activeIndex = event;
    switch (event) {
      case 0:
        this.links(InsMolOptComponent);
        break;
      case 1:
        this.links(InsMolRolComponent);
        break;
    }
  }

  public links(component: any) {
    let miComponent : any = component;
    let componentFactory  = this.componentFactoryResolver.resolveComponentFactory(miComponent);
    this.receptor?.viewContainerRef.clear();
    this.receptor?.viewContainerRef.createComponent(componentFactory);
    return false;
  }

 
}

