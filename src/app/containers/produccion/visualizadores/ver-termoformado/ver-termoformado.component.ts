import { Component, Input, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-ver-termoformado',
  templateUrl: './ver-termoformado.component.html',
  styleUrls: ['./ver-termoformado.component.css']
})
export class VerTermoformadoComponent implements OnInit {

  @Input() orden : any ;

  active                = 1;
  termoformado : any ;
  token                 ='';
  parametros   : any [] = [];

  constructor(private servicioget :RestService,
              private servicio    :UsersService ) { 

    this.token = this.servicio.getToken();
  }

  ngOnInit(): void {

    let parm : any[]  = [{key :'idOrdt' ,value: this.orden.id }, {key :'idOrdtd' ,value: this.orden.id_det } ];

    this.servicioget.get('verOtTer' , this.token, parm).subscribe(respuesta => {
        this.termoformado = respuesta;
    });
  }

 


}
