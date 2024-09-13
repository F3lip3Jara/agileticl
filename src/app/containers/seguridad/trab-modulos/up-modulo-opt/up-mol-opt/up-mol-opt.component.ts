import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-up-mol-opt',
  templateUrl: './up-mol-opt.component.html',
  styleUrls: ['./up-mol-opt.component.scss']
})
export class UpMolOptComponent {

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
              private route        : ActivatedRoute,
              fgIns                : FormBuilder,
              private alert        : AlertasService,
              private moduloser    : ModuloService){
  
      this.token = this.servicio.getToken();
     
   
}
  ngOnInit(): void {
   
    this.optAsig  = this.moduloser.getOptAsig();
    this.optnAsig = this.moduloser.getOptnAsig();
  
  }

  icono(icono :any){
    this.icon = icono;
    
  }
  moveDisabledItems(event:any) {
    const items = event.items;
    items.forEach((item:any) => {
        if (!item.movable) {
            // Revertir el movimiento
            this.alert.setAlert( 'No se puede modificar los Sub Módulos', 'warning');
            const index = this.optnAsig.indexOf(item);
            if (index !== -1) {
                this.optnAsig.splice(index, 1);
                this.optAsig.push(item);
            }
        }else{
          let parm:any = {tipo:'O' , parm:this.optAsig };
          this.moduloser.disparador.emit(parm)
          this.moduloser.setOptAsig(this.optAsig);
          this.moduloser.setOptnAsig(this.optnAsig);
        }
    });
  }


}
