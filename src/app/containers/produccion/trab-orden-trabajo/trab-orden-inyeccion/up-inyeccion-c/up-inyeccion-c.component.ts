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
  selector: 'app-up-inyeccion-c',
  templateUrl: './up-inyeccion-c.component.html',
  styleUrls: ['./up-inyeccion-c.component.css']
})
export class UpInyeccionCComponent implements OnInit {
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
  inymoDetO    : any[]                = [];  
  inyeccion    : any                  = {};
  terTip       :string                = '';
  pallet       : any                  = {};
  extLotSal    : string               = '';
  rechazo      : any                  = {};
  myReader     : FileReader                 = new FileReader();
  nombreArch   : string               = '';
  inyArchivo   : any[]                = [];
  inyPeso      : any[]                = [];
  insArch      : FormGroup;
    
    
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
                  inydDefecto    : ['', Validators.compose([
                  Validators.required,
                  ])],
                  inydRechazo    : ['', Validators.compose([
                    Validators.required                   
                    ])],
                  inydLimp    : ['', Validators.compose([
                      Validators.required                   
                  ])],
               
                   
                });
                
                           
                this.insCtl = fg.group({                
                     inyMerma    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                     ])],
                });

                this.insArch = fg.group({
                  archivos    : ['', Validators.compose([
                    Validators.required,
                    ])]
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
      this.inymoDetO = data.inyeccionDet;
    

      this.inyeccion.forEach((element: any) => {
        this.idIny     = element.idIny;          
        if(this.idIny > 0){
          this.carga    = 'visible';
          this.loading  = false;
          this.val      = false;
        }
      });

      data.inyeccionDetC.forEach((element:any) => {
        let inyeccion ={ inydHorIni: element.inydHorIni, inydRechazo: element.inydRechazo , inydLimp:element.inydLimp , inydObs:element.inydObs , inydDefecto:element.inydDefecto ,inydidMot:element.inydidMot , inydEst : element.inydEst} ;
        this.inymoDet.push(inyeccion);
      });

      data.inyeArch.forEach((element:any)=>{
        let archivo = {'nombre' : element.inyarlink};
        this.inyArchivo.push(archivo);
      });

      data.inyPeso.forEach((element:any)=>{
        let pesos = {'inypPeso' : element.inypPeso,'inyptip' : element.inyptip};
        this.inyPeso.push(pesos);
      });
    });
    this.serviLoad.sumar.emit(4);
  }

  volver(){
    const d = 'inyeccion';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  insInyDetalle(inydDefecto : any ,inydRechazo:any , inydLimp : any ,  inydObs:any){
    this.todayWithPipe = this.pipe.transform(Date.now(), 'HH:mm');
     let inydDefectox = inydDefecto.split(',');  
     let inyeccion ={ inydHorIni: this.todayWithPipe, inydRechazo: inydRechazo , inydLimp:inydLimp , inydObs:inydObs , inydDefecto:inydDefectox[1] ,inydidMot:inydDefectox[0] , inydEst : 'P'} ;
     this.inymoDet.push(inyeccion);
     this.modal.dismissAll();      
     this.insInyDet.reset();      
   }

  delPrd(index:any ){
      this.inymoDet.splice(index , 1);
  }

  insCtlProd(modalInsCtl : any){
    this.modal.open(modalInsCtl , {size:'lg'});
  }

  terminar(content : any){  
     this.modal.open(content , {size:'lg'});
  }

 insTermCierre(){
    this.val      = true;
    this.serviLoad.sumar.emit(1);   
    let par : any = [{'id': this.idIny, 'inyDet': this.inymoDet , 'inyPeso' : this.inyPeso}];
    this.serviRest.post('insInyCierreC', this.token, par).subscribe(resp => {
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

  insPesos(inypPeso : any){
    let pesos = {'inypPeso' : inypPeso,'inyptip' : 'C'};
    this.inyPeso.push(pesos);
  }

  
  public insArchivos(archivo : any){
    let archivos = {'nombre': archivo.nombre , 'base64': archivo.base64 , 'idIny': this.idIny}; 
    this.serviRest.post('uploadArIny', this.token, archivos).subscribe(resp => {     
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> {
             this.modal.dismissAll(); 
             this.inyArchivo.push(archivos);  
              },1000 );
          }else{
            this.carga    = 'visible';
            this.loading  = false;
            this.val      = false;
          }
       });
    });      
    this.servicioAlert.disparador.emit(this.servicioAlert.getAlert()); 
    this.insArch.reset();     
    this.modal.dismissAll();
  }
 
  delPeso(index:any){
    this.inyPeso.splice(index , 1);
  }

  delArch(index:any , archivo : any){
    this.inyArchivo.splice(index , 1);
    let parm = [{'idIny' : this.idIny , 'archivo': archivo}];
    this.serviRest.post('delInyArcv', this.token, parm).subscribe(resp => {
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> {   
              this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());  
              this.modal.dismissAll();       
              },1000 );
          }else{
            this.carga    = 'visible';
            this.loading  = false;
            this.val      = false;
          }
       });
      });
  }


}
