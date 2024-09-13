import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
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
              private alert        : AlertasService,
              private moduloser    : ModuloService
    ){
  
      this.token = this.servicio.getToken();

      this.ins = fgIns.group({
        molDes : ['' , Validators.compose([
          Validators.required,
         ])]
        
      });
}
  ngOnInit(): void {

    this.optAsig  = this.moduloser.getRolAsig();
    this.optnAsig = this.moduloser.getRolnAsig();

    console.log(this.optnAsig);
    
  
  }

  
  moveDisabledItems(event:any) {
    let parm:any = {tipo:'R' , parm:this.optAsig };
     this.moduloser.disparador.emit(parm);

      this.moduloser.setRolAsig(this.optAsig);      
      this.moduloser.setRolnAsig(this.optnAsig);
  }


}
