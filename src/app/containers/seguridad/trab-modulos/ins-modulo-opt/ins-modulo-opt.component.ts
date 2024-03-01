import { Component } from '@angular/core';
import { faArrowTurnDown, faArrowUp, faStar } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ins-modulo-opt',
  templateUrl: './ins-modulo-opt.component.html',
  styleUrls: ['./ins-modulo-opt.component.scss']
})
export class InsModuloOptComponent {
  token           : string  = '';
  parametros      : any     = [];
  val             : boolean = false;
  valRut          : boolean = false;
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

  constructor( private servicio     : UsersService,
               private rest         : RestService,             
               private serviLoad    : LoadingService,
               private servicioalert: AlertasService,
               fgIns                : FormBuilder){
              
                this.token = this.servicio.getToken();

                this.ins = fgIns.group({
                  molDes : ['' , Validators.compose([
                    Validators.required,
                   ])]
                  
                });
              
              }

  ngOnInit(){
    
    this.rest.get('snAsig', this.token,this.parametros).subscribe(data => {
      this.optnAsig = data;
    });
    
    this.rest.get('asig', this.token,this.parametros).subscribe(data => {
      this.optAsig = data;
    });

    this.rest.get('snAsigRol', this.token,this.parametros).subscribe(data => {
      this.rolSnAsig = data;
    });

    this.rest.get('asigRol', this.token,this.parametros).subscribe(data => {
      this.rolAsig = data;
    });
   
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  guardar( molDes: any ){
    this.parametros   = {molId: this.modulo.molId , opt:this.optAsig , molDes: molDes , molIcon : this.icon , ok:'S' , roles:this.rolAsig};
    this.val          = true;
    this.serviLoad.sumar.emit(1);
    this.rest.post('insModulo', this.token, this.parametros).subscribe(resp => {
        this.val = false;
        this.servicioalert.disparador.emit();
    });
  
  }

  icono(icono :any){
      this.icon = icono;
      
  }
 
}

