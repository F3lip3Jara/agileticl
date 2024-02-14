import { Component, OnInit } from '@angular/core';
import { TareasService } from './../../../../../servicios/tareas.service';
import { LoadingService } from './../../../../../servicios/loading.service';
import { AlertasService } from './../../../../../servicios/alertas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from './../../../../../servicios/rest.service';
import { LinksService } from './../../../../../servicios/links.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-up-inyeccion-o',
  templateUrl: './up-inyeccion-o.component.html',
  styleUrls: ['./up-inyeccion-o.component.css']
})

export class UpInyeccionOComponent implements OnInit {
  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible"; 
  insCtl       : FormGroup;
  insInyDet    : FormGroup;
  inyLotSal    : string               = '';
  token        : string               = '';
  sacas        : any ;
  parametros   : any []               = [];
  producto     : any                  = {};
  val          : boolean              = false;
  fechaS       : string               = '';
  config       :any                   = {};
  maquinas     : any ;
  valGuar      : boolean              = true;
  diaJul       : any;
  isEnabled    : boolean              = false;
  terLotSal    : string               = '';
  idIny        : number               = 0;
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
  inymoDet     : any[]                = [];  
  inyeccion : any                  = {};
  terTip       :string                = '';
  pallet       : any                  = {};
  extLotSal    : string               = '';
  rechazo      : any                  = {};
    
    
constructor(   private servicioLink : LinksService,
               private serviRest    : RestService,
               private servicio     : UsersService,
               private modal        : NgbModal,
               private fg           : FormBuilder,
               private servicioAlert: AlertasService,
               private serviLoad    : LoadingService,
               private serTareas    : TareasService) {
                this.sacas         = {};
                this.insumos       = {};
                this.maquinas      = {};
                this.token         = this.servicio.getToken();
                this.orden_trabajo = this.serTareas.getExtrusion();
                this.inyLotSal     = this.orden_trabajo.lote_salida;
                
                this.insInyDet= fg.group({ 
                  inydHorIni    : ['', Validators.compose([
                  Validators.required,
                  ])],
                  inydConmutacion    : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                    ])],
                  inydPesoCaja    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                  ])],
                  inydCaja     : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                   ])],
                   inydDefecto: ['', Validators.compose([
                    Validators.required                    
                   ])],
                });
                           
                this.insCtl = fg.group({
                  inyCavTot    : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                    ])],
                    inyCavAct    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                      ])],
                    inyLimpieza    : ['', Validators.compose([
                        Validators.required,
                       
                    ])],
                    inyReproceso    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                     ])],
                     inyMerma    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                     ])],
                });
   }

  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd-MM-yyyy');
    this.parametros = [{key:'idEta' , value : 7}];

    this.serviRest.get('filEta', this.token , this.parametros).subscribe(data => {
      this.maquinas = data;
    });

    this.serviRest.get('prodInsumo', this.token , this.parametros).subscribe(data => {
      this.insumos = data;
    });
        
    let etapas      = [7];   
    this.parametros = [{"key": "etapas" , "value" :etapas}];  
    this.serviRest.get('motEta', this.token , this.parametros).subscribe(data =>{
      this.rechazo = data;
    });
  
    this.parametros = [{"key": "inyLotSal" , "value" :this.inyLotSal} , {"key": "idIny" , "value" :this.orden_trabajo.id_inye}];  
    this.serviRest.get('inyeccion', this.token , this.parametros).subscribe((data:any) => {     
      this.inyeccion = data.inyeccion;
      this.inymoDet  = data.inyeccionDet;

      this.inyeccion.forEach((element: any) => {
        this.idIny     = element.idIny;
        this.insCtl.controls['inyCavTot'].setValue(element.inyCavTot);
        this.insCtl.controls['inyCavAct'].setValue(element.inyCavAct);
        this.insCtl.controls['inyLimpieza'].setValue(element.inyLimpieza);
        this.insCtl.controls['inyReproceso'].setValue(element.inyReproceso);
        this.insCtl.controls['inyMerma'].setValue(element.inyMerma);            
        if(this.idIny > 0){
          this.carga    = 'visible';
          this.loading  = false;
          this.val      = false;
        }
      });
    });
    this.serviLoad.sumar.emit(4);
  }

  volver(){
    const d = 'inyeccion';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  insInyDetalle(inydHorInix : any ,inydConmutacion:any , inydPesoCaja : any ,  inydCaja:any, inydDefecto:any){
    let horaI     = inydHorInix.hour; 
    let minI      = inydHorInix.minute; 

     if(inydHorInix.hour < 10){
       horaI = '0' + inydHorInix.hour
     }
     if(inydHorInix.minute  < 10){
       minI = '0' + inydHorInix.minute;
     }

     let inydHorIni =  horaI + ':' + minI;  
     let inydDefectox = inydDefecto.split(',');  
     let inyeccion ={inydHorIni: inydHorIni , inydConmutacion: inydConmutacion , inydPesoCaja:inydPesoCaja , inydCaja:inydCaja , inydDefecto:inydDefectox[1] ,inydidMot:inydDefectox[0] , inydEst : 'P'} ;
     this.inymoDet.push(inyeccion);
     this.modal.dismissAll();    
     this.peso      = '';
     this.ancho     = '';
     this.espesor   = '';
     this.insInyDet.reset();
     this.extLotSal = '';   
   }

  delPrd(index:any , termo:any){
      this.inymoDet.splice(index , 1);
  }


  insCtlProd(modalInsCtl : any){
    this.modal.open(modalInsCtl , {size:'lg'});
  }

  terminar(content : any){  
     this.modal.open(content , {size:'lg'});
  }

 insTermCierre(inyCavTot:any, inyCavAct:any,inyLimpieza:any,inyReproceso:any, inyMerma:any ){
    this.val      = true;
    this.serviLoad.sumar.emit(1);   
    let par : any = [{'id': this.idIny, 'inyCavTot' : inyCavTot , 'inyCavAct' : inyCavAct , 'inyLimpieza': inyLimpieza  ,'inyReproceso': inyReproceso, 'inyMerma' : inyMerma,'inyDet': this.inymoDet}];
    this.serviRest.post('insInyCierre', this.token, par).subscribe(resp => {
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> {
              const d = 'inyeccion';
              this.servicioLink.disparador.emit(d);    
              this.modal.dismissAll();       
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
}