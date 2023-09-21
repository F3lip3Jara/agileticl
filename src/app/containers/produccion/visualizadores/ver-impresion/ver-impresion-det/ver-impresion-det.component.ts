import { Component, OnInit,Input} from '@angular/core';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-ver-impresion-det',
  templateUrl: './ver-impresion-det.component.html',
  styleUrls: ['./ver-impresion-det.component.css']
})
export class VerImpresionDetComponent implements OnInit {
  @Input() orden_trabajo : any ;
  token                  : string = '';
  parametros             : any[]  = [] ;
  impDet                 : any[]  = [];
  impPeso              : any[]  = [];
  impTinta               : any[]  = [];
  
  constructor(private servicioget :RestService,
              private servicio    :UsersService ) { 
    this.token = this.servicio.getToken();
    }


  ngOnInit(): void {
    this.parametros = [{"key": "idImp" , "value" :this.orden_trabajo.id_impre}];  
    this.servicioget.get('impresion', this.token , this.parametros).subscribe((data:any) => {          
        this.impDet    = data.impresionDet;
        this.impTinta  = data.impTinta;
        this.impPeso   = data.impPeso;    
   });
  }



}
