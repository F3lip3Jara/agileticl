import { Component, Input, OnInit } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-ver-inyeccion', 
  templateUrl: './ver-inyeccion.component.html',
  styleUrls: ['./ver-inyeccion.component.css']
})
export class VerInyeccionComponent implements OnInit {

  @Input() orden : any ;

  active                = 1;
  inyecciones : any ;
  token                 ='';
  parametros   : any [] = [];

  constructor(private servicioget :RestService,
              private servicio    :UsersService ) { 

    this.token = this.servicio.getToken();
  }

  ngOnInit(): void {

    let parm : any[]  = [{key :'idOrdt' ,value: this.orden.id }, {key :'idOrdtd' ,value: this.orden.id_det } ];

    this.servicioget.get('verOtIny' , this.token, parm).subscribe(respuesta => {
        this.inyecciones = respuesta;
    });
  }

 


}
