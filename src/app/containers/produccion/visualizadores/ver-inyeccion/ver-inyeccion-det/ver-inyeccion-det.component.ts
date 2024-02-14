import { Component, OnInit, Input } from '@angular/core';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-ver-inyeccion-det',
  templateUrl: './ver-inyeccion-det.component.html',
  styleUrls: ['./ver-inyeccion-det.component.css']
})
export class VerInyeccionDetComponent implements OnInit {

  @Input() orden_trabajo : any ;
  token                  : string = '';
  parametros             : any[]  = [];
  inyDet     : any[]              = [];
  inyDetC    : any[]              = [];
  inyPeso    : any[]              = [];
  inyArchivo : any[]              = [];

  constructor(private servicioget :RestService,
              private servicio    :UsersService ) { 
          this.token = this.servicio.getToken();
  }

  ngOnInit(): void {
     this.parametros = [{"key": "idIny" , "value" :this.orden_trabajo.id_inye}];
      
     this.servicioget.get('inyeccion', this.token , this.parametros).subscribe((data:any) => {

      this.inyDet     = data.inyeccionDet;       
      this.inyDetC    = data.inyeccionDetC;
      this.inyArchivo = data.inyeArch;
      this.inyPeso    = data.inyPeso;
     });

  }

  downloadDoc(nombre:any){  
    this.parametros = [{key:'archivo' , value : nombre },{ key: 'tipo' , value : 'inyeccion'}];
    this.servicioget.get('archivos', this.token , this.parametros).subscribe((data:any) => {     
      console.log(data);    
      window.open(data.url,'_blank');
    });
  }


}


