import { Component, Input, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-ver-impresion',
  templateUrl: './ver-impresion.component.html',
  styleUrls: ['./ver-impresion.component.css']
})
export class VerImpresionComponent implements OnInit {

  @Input() orden : any ;

  active                = 1;
  impresion : any ;
  token                 ='';
  parametros   : any [] = [];

  constructor(private servicioget :RestService,
              private servicio    :UsersService ) { 

    this.token = this.servicio.getToken();
  }

  ngOnInit(): void {

    let parm : any[]  = [{key :'idOrdt' ,value: this.orden.id }, {key :'idOrdtd' ,value: this.orden.id_det } ];

    this.servicioget.get('verOtImp' , this.token, parm).subscribe(respuesta => {
        this.impresion = respuesta;
    });
  }

 

}
