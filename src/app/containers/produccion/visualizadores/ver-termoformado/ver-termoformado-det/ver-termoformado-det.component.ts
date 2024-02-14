import { Component, Input, OnInit } from '@angular/core';
import { TermoDet } from 'src/app/model/termoDet.model';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-ver-termoformado-det',
  templateUrl: './ver-termoformado-det.component.html',
  styleUrls: ['./ver-termoformado-det.component.css']
})
export class VerTermoformadoDetComponent implements OnInit {

  @Input() orden_trabajo : any ;
  token                  : string = '';
  parametros             : any[]  = [] ;
  termoDet               : any[]  = [];
  termoDetC              : any[]  = [];
  termoPeso              : any[]  = [];
  termoArchivo           : any[]  = [];


  constructor(private servicioget :RestService,
              private servicio    :UsersService ) { 
          this.token = this.servicio.getToken();
  }

  ngOnInit(): void {
     this.parametros = [{"key": "idTer" , "value" :this.orden_trabajo.id_termo}];
     this.servicioget.get('termoformado', this.token , this.parametros).subscribe((data:any) => {
      
      this.termoPeso    = data.termoPeso;
      this.termoDet     = data.termoDet;
      this.termoDetC    = data.termoDetC;
      this.termoArchivo = data.termoArch;
   
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
