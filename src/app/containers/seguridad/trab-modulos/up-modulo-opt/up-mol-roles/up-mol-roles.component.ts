import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-up-mol-roles',
  templateUrl: './up-mol-roles.component.html',
  styleUrls: ['./up-mol-roles.component.scss']
})
export class UpMolRolesComponent {

  token             : string  = '';
  parametros        : any     = [];
  modulo            : any     = {};
  optAsig           : any     = [];
  sub               : any     = []
  optnAsig          : any     = [];
  icon              : string  = '';
  ins               : FormGroup;


  constructor( private servicio    : UsersService,
              private rest         : RestService,
              private router       : Router,
              private route        : ActivatedRoute,
              fgIns                : FormBuilder,
              private alert        : AlertasService
    ){
  
      this.token = this.servicio.getToken();

      this.ins = fgIns.group({
        molDes : ['' , Validators.compose([
          Validators.required,
         ])]
        
      });
}
  ngOnInit(): void {

      this.route.params.subscribe((params :any) => {
        let parm:any = JSON.parse(atob(params.array));
        this.optAsig  = parm.optAsig;
        this.optnAsig = parm.optnAsig;
        this.modulo   = parm.modulo;
        this.icon     = parm.modulo.molIcon;
        this.ins.controls['molDes'].setValue(this.modulo.molDes);
        
      });
  
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
        }
    });
  }


}
