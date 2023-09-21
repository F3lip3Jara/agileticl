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
  selector: 'app-ins-envasado',
  templateUrl: './ins-envasado.component.html',
  styleUrls: ['./ins-envasado.component.css']
})
export class InsEnvasadoComponent implements OnInit {

  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible";
  insEnv       : FormGroup;
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
  envDet       : any[]                = [];
  termoPeso    : any[]                = [];
  pallet       : any                  = {};
    
  constructor( private servicioLink : LinksService,
               private serviRest    : RestService,
               private servicio     : UsersService,
               private modal        : NgbModal,
               private fg           : FormBuilder,
               private servicioAlert: AlertasService,
               private serviLoad    : LoadingService,
               private serTareas    : TareasService

               ) {
                this.sacas         = {};
                this.insumos       = {};
                this.maquinas      = {};
                this.token         = this.servicio.getToken();
                this.orden_trabajo = this.serTareas.getExtrusion();

                this.insEnv= fg.group({
                  envMaq    : ['', Validators.compose([
                  Validators.required,
                  ])],
                
                  envPrdCaja : ['', Validators.compose([
                      Validators.required,
                      ])],
                  envPrdBolsa : ['', Validators.compose([
                        Validators.required,
                        ])],
                  envLotCaja : ['', Validators.compose([
                        Validators.required,
                        ])],
                  envLotBolsa : ['', Validators.compose([
                          Validators.required,
                  ])],

                  envTurn: ['', Validators.compose([
                    Validators.required,
                   ])],
                });

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
                  ])]
                });

               

   }

  ngOnInit(): void {
    this.serviRest.get('diaJul', this.token , this.parametros).subscribe(data => {
      this.diaJul = data;
        if(this.diaJul =='0'){
          this.valJul = true;
        }else{
          this.loading = false;
          this.carga   = 'visible';
        }
     
    });

    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd-MM-yyyy');

    this.parametros = [{key:'idEta' , value : 6}];
    this.serviRest.get('filEta', this.token , this.parametros).subscribe(data => {
      this.maquinas = data;
    });
    this.serviRest.get('prodInsumo', this.token , this.parametros).subscribe(data => {
      this.insumos = data;
    });    
    this.serviLoad.sumar.emit(3);
  }

  insEnvasado(envMaq:any ,  envPrdCaja:any , envPrdBolsa:any ,envLotCaja:any ,  envLotBolsa:any, envTurn:any){
    this.serviLoad.sumar.emit(1);
    this.parametros  = [];
    this.parametros  = [{'idEnv': this.orden_trabajo.id_envasado , 'envMaq' : envMaq ,  'envPrdCaja' : envPrdCaja, 'envPrdBolsa': envPrdBolsa, 'envLotCaja': envLotCaja , 'envLotBolsa' : envLotBolsa , 'envTurn' : envTurn , 'envDia' : this.diaJul} ] ;
    this.serviRest.post('upEnv', this.token, this.parametros).subscribe(resp => {
      this.val = true;
      resp.forEach((elementx : any)  => {
      if(elementx.error == '0'){
          this.isEnabled  = true;
          console.log(elementx.data);
          let datos       = elementx.data;
          datos.forEach((element : any) => {             
              this.envLotSal = element.envLotSal;
          });
          setTimeout(()=> {
            this.val= false;
            this.valGuar = true;
            },1000 );
        }else{
          this.carga    = 'visible';
          this.loading  = false;
          this.val      = false;
        }
     });
    });
    this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
  }

  volver(){
    const d = 'envasado';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  insCtlProd(modalInsCtl : any){
    this.modal.open(modalInsCtl , {size:'lg'});
  }



  insEnvDetalle(envdHorInix : any ,envdHorFinx:any , envdCaja : number ){
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

    let envasado = {'envdHorIni': envdHorIni , 'envdHorFin': envdHorFin, 'envdCaja' : envdCaja } ;
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
        this.modal.dismissAll();
          setTimeout(()=> {
            this.val= false;
            this.valGuar = true;
            this.servicioLink.disparador.emit('envasado');
            this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
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

  public  verTermoPallet(content:any , termo:any) {
   
  }

}
