import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { LinksService } from 'src/app/servicios/links.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { TareasService } from 'src/app/servicios/tareas.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-up-envasado-o',
  templateUrl: './up-envasado-o.component.html',
  styleUrls: ['./up-envasado-o.component.css']
})
export class UpEnvasadoOComponent implements OnInit {

 
  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible";
  envLotSal    : string               = '';
  insEnvDet    : FormGroup;
  token        : string               = '';
  sacas        : any ;
  parametros   : any []               = [];
  producto     : any                  = {};
  val          : boolean              = false;
  fechaS       : string               = '';
  config       :any                   = {};
  maquinas     : any ;
  valGuar      : boolean              = false;
  diaJul       : any;
  isEnabled    : boolean              = false;
  terLotSal    : string               = '';
  idTer        : number               = 0;
  valJul       : boolean              = false;
  etapas       : any                  = {};
  today        : Date                 = new Date();
  pipe                                = new DatePipe('en-US');
  todayWithPipe: any;
  insumos      : any;
  orden_trabajo: any;
  peso         : string               = '';
  ancho        : string               = '';
  espesor      : string               = '';
  envDet       : any                  = {};
  termoPeso    : any[]                = [];
  pallet       : any                  = {};
  idEnv        : number               = 0;
    
  constructor( private servicioLink : LinksService,
               private serviRest    : RestService,
               private servicio     : UsersService,
               private modal        : NgbModal,
               private fg           : FormBuilder,
               private servicioAlert: AlertasService,
               private serviLoad    : LoadingService,
               private serTareas    : TareasService

               ) {
                this.token         = this.servicio.getToken();
                this.orden_trabajo = this.serTareas.getExtrusion();
                this.envLotSal     = this.orden_trabajo.lote_salida;
                this.idEnv         = this.orden_trabajo.id_envasado;

                console.log(this.orden_trabajo);
                this.loading  = false;
                this.carga    = 'visible';
                
                this.insEnvDet= fg.group({ 
                  envdHorIni    : ['', Validators.compose([
                  Validators.required,
                  ])],
                  envdHorFin    : ['', Validators.compose([
                    Validators.required,
                    ])],
                  envdCaja      : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                  ])],
                  envdPallet    : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                   ])],
                });

               

   }

  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd-MM-yyyy');
    this.parametros = [{key:'idEnv' , value : this.idEnv}];
    this.serviRest.get('envDet', this.token , this.parametros).subscribe(data => {
        this.envDet = data;
    });

    
  }

  volver(){
    const d = 'envasado';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  insCtlProd(modalInsCtl : any){
    this.modal.open(modalInsCtl , {size:'lg'});
  }


  insEnvDetalle(envdHorInix : any ,envdHorFinx:any , envdCaja : number ,  envdPallet:number){
   let horaI     = envdHorInix.hour; 
   let minI      = envdHorInix.minute; 

    if(envdHorInix.hour < 10){
      horaI = '0' + envdHorInix.hour
    }
    if(envdHorInix.minute  < 10){
      minI = '0' + envdHorInix.minute;
    }   
    let envdHorIni =  horaI + ':' + minI;  

    let horaF     = envdHorFinx.hour; 
    let minF      = envdHorFinx.minute; 

    if(envdHorFinx.hour < 10){
      horaF = '0' + envdHorFinx.hour
    }
    if(envdHorFinx.minute  < 10){
      minF = '0' + envdHorFinx.minute;
    }   

    let envdHorFin =  horaI + ':' + minI;  

    let envasado = {'envdHorIni': envdHorIni , 'envdHorFin': envdHorFin, 'envdCaja' : envdCaja , 'envdPallet':envdPallet} ;
    this.envDet.push(envasado);
    this.modal.dismissAll();   
    this.insEnvDet.reset();
  }

  delPrd(index:any, termo:any){
    this.envDet.splice(index , 1);
   }
   
  terminar(content : any){
    this.modal.open(content , {size:'lg'});
  }
  
  insTermCierre( ){
    this.serviLoad.sumar.emit(1);
    this.parametros  = [];
    this.parametros  = [{'idEnv': this.orden_trabajo.id_envasado , 'envDet': this.envDet}] ;
    this.serviRest.post('insEnvDet', this.token, this.parametros).subscribe(resp => {
      this.val = true;
      resp.forEach((elementx : any)  => {
      if(elementx.error == '0'){
          this.isEnabled  = true;
          setTimeout(()=> {
            this.val= false;
            this.valGuar = true;
            this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
            this.servicioLink.disparador.emit('envasado');
            },1000 );
        }else{
          this.carga    = 'visible';
          this.loading  = false;
          this.val      = false;
        }
     });
    });
  
   // this.servicioLink.disparador.emit('envasado');
  } 


}
