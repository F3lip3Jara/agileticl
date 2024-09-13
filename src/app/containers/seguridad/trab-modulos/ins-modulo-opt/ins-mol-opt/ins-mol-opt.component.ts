import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-ins-mol-opt',
  templateUrl: './ins-mol-opt.component.html',
  styleUrls: ['./ins-mol-opt.component.scss']
})
export class InsMolOptComponent {
  
    token             : string  = '';
    parametros        : any     = [];
    modulo            : any     = {};
    optAsig           : any     = [];
    sub               : any     = []
    optnAsig          : any     = [];
    icon              : string  = '';
   
  
    constructor( private servicio    : UsersService,
                private rest         : RestService,
                private router       : Router,               
                private alert        : AlertasService,
                private moduloser    : ModuloService
               ){
    
        this.token = this.servicio.getToken();
  
     
  }
    ngOnInit(): void {
     this.optnAsig = this.moduloser.getOptnAsig();
     this.optAsig  = this.moduloser.getOptAsig();
       
    
    }
  
    icono(icono :any){
      this.icon = icono;
      
    }
    moveDisabledItems(event:any) {
      const items = event.items;
      this.moduloser.setOptAsig(this.optAsig);
      this.moduloser.setOptnAsig(this.optnAsig);
      let parm:any = {tipo:'O' , parm:this.optAsig };
      this.moduloser.disparador.emit(parm);
    }
  
  
  }
  