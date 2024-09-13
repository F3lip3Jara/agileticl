import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowTurnDown, faArrowUp, faStar } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ReceptorDirective } from 'src/app/servicios/receptor.directive';
import { UpMolRolesComponent } from './up-mol-roles/up-mol-roles.component';
import { UpMolOptComponent } from './up-mol-opt/up-mol-opt.component';


@Component({
  selector: 'app-up-modulo-opt',
  templateUrl: './up-modulo-opt.component.html',
  styleUrls: ['./up-modulo-opt.component.scss']
})
export class UpModuloOptComponent {

  @ViewChild(ReceptorDirective, { static: true }) receptor?: ReceptorDirective;


  token           : string  = '';
  parametros      : any     = [];
  val             : boolean = false;
  mensaje         : string  = '';
  faArrowTurnDown           = faArrowTurnDown;
  modulo          : any     = {};
  optAsig         : any     = [];
  sub             :any      = []
  optnAsig        : any     = [];
  faStar                    = faStar;
  faArrowUp                 = faArrowUp;
  ins             : FormGroup;
  icon            : string  = '';
  rolAsig         : any     = [];

  items: MenuItem[] | undefined;
  activeIndex: number       = 0;
  active: number            = 0;

  constructor( private servicio     : UsersService,
               private rest         : RestService,
               private serviLoad    : LoadingService,
               private route        : ActivatedRoute,
               fgIns                : FormBuilder,
               private moduloser    : ModuloService,
               private componentFactoryResolver: ComponentFactoryResolver,
              ){
              
                this.token = this.servicio.getToken();

                this.ins = fgIns.group({
                  molDes : ['' , Validators.compose([
                    Validators.required,
                   ])]
                  
                });

           
              }

  ngOnInit(){
  
    this.moduloser.clear(); 
   
    this.items = [
      {
          label: 'Opciones'
      },
      {
          label: 'Roles'
      }
    ];

    this.route.params.subscribe((params :any) => {
      let parm:any = JSON.parse(atob(params.array));
      this.modulo   = parm.modulo;
      this.icon     = parm.modulo.molIcon;
      this.ins.controls['molDes'].setValue(this.modulo.molDes);
    
      this.moduloser.setOptAsig(parm.optAsig);
      this.moduloser.setRolAsig(parm.rolAsig);       
      this.moduloser.setOptnAsig(parm.optnAsig);
      this.moduloser.setRolnAsig(parm.rolnAsi);

      this.optAsig = this.moduloser.getOptAsig();
      this.rolAsig = this.moduloser.getRolAsig();
      

     
     
    });

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

   

    this.links(UpMolOptComponent);
  }
  
  guardar(molDes:any){
   this.parametros    = {molId: this.modulo.molId , opt:this.optAsig , molDes: molDes , molIcon : this.icon , ok:'S' , roles:this.rolAsig};
    this.val          = true;
    this.serviLoad.sumar.emit(1);
    this.rest.post('upModulo', this.token, this.parametros).subscribe(resp => {
        this.val = false;
    });
    
  }


  public links(component: any) {
    let miComponent : any = component;
    let componentFactory  = this.componentFactoryResolver.resolveComponentFactory(miComponent);
    this.receptor?.viewContainerRef.clear();
    this.receptor?.viewContainerRef.createComponent(componentFactory);
    return false;
  }

  onActiveIndexChange(event: number) {
   
    this.activeIndex = event;
    switch (event) {
      case 0:
        this.links(UpMolOptComponent);
        break;
      case 1:
        this.links(UpMolRolesComponent);
        break;
    }
  }

  icono(icono :any){
    this.icon = icono;    
  }

 
 
}
