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
  selector: 'app-up-impresion-o',
  templateUrl: './up-impresion-o.component.html',
  styleUrls: ['./up-impresion-o.component.css']
})
export class UpImpresionOComponent implements OnInit {
  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible"; 
  insCtl       : FormGroup;
  insImpDet    : FormGroup;
  impLotSal    : string               = '';
  token        : string               = '';
  bins         : any ;
  parametros   : any []               = [];
  producto     : any                  = {};
  val          : boolean              = false;
  fechaS       : string               = '';
  config       : any                   = {};
  maquinas     : any ;
  valGuar      : boolean              = true;
  diaJul       : any;
  isEnabled    : boolean              = false;
  terLotSal    : string               = '';
  idImp        : number               = 0;
  valJul       : boolean              = false;
  etapas       : any                  = {};
  today        : Date                 = new Date();
  pipe                                = new DatePipe('en-US');
  todayWithPipe: any;
  insumos      : any;
  orden_trabajo: any; 
  impDet       : any[]                = [];  
  impresion    : any                  = {};
  imprePeso    : any[]                = [];  
  impTinta     : any[]                = [];  
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
               private serviLoad    : LoadingService ,
               private serTareas    : TareasService) {
                this.bins          = {};
                this.insumos       = {};
                this.maquinas      = {};
                this.token         = this.servicio.getToken();
                this.orden_trabajo = this.serTareas.getExtrusion();
                this.impLotSal     = this.orden_trabajo.lote_salida;

                this.insImpDet= fg.group({ 
                  impdHorIni    : ['', Validators.compose([
                  Validators.required,
                  ])],
                 
                  impdPesoCaja    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                  ])],
                  impdCajaAcu     : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                   ])],
                   impdDefecto: ['', Validators.compose([
                    Validators.required                    
                   ])],
                });


                           
                this.insCtl = fg.group({                  
                  impBasura    : ['', Validators.compose([
                        Validators.required,
                       
                    ])],
                    impReproceso    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                     ])],
                     impMerma    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                     ])],
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

    this.parametros = [{key:'idEta' , value : 8}];
    this.serviRest.get('filEta', this.token , this.parametros).subscribe(data => {
      this.maquinas = data;
    });
    this.serviRest.get('prodInsumo', this.token , this.parametros).subscribe(data => {
      this.insumos = data;
    });    
    this.serviRest.get('getBinsT', this.token , this.parametros).subscribe(data => {
      this.bins = data;    
    });
    let etapas      = [8];   
    this.parametros = [{"key": "etapas" , "value" :etapas}];  
    this.serviRest.get('motEta', this.token , this.parametros).subscribe(data =>{
      this.rechazo = data;   
    });

    this.parametros = [{"key": "impLotSal" , "value" :this.impLotSal}];  
    this.serviRest.get('impresion', this.token , this.parametros).subscribe((data:any) => {     
      this.impresion = data.impresion;
      this.impDet    = data.impresionDet;
      this.impTinta  = data.impTinta;
      this.imprePeso = data.impPeso;

      this.impresion.forEach((element: any) => {
        this.idImp     = element.idImp;
        this.insCtl.controls['impBasura'].setValue(element.impBasura);
        this.insCtl.controls['impReproceso'].setValue(element.impReproceso);
        this.insCtl.controls['impMerma'].setValue(element.impMerma);            
        if(this.idImp > 0){
          this.carga    = 'visible';
          this.loading  = false;
          this.val      = false;
        }
      });
    });


    this.serviLoad.sumar.emit(5);
  }

  volver(){
    const d = 'impresion';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  insImpDetalle(impdHorInix : any, impdPesoCaja : any ,  impdCajaAcu:any, impdDefecto:any){
    let horaI      = impdHorInix.hour; 
    let minI      = impdHorInix.minute; 
     if(impdHorInix.hour < 10){
       horaI = '0' + impdHorInix.hour
     }
     if(impdHorInix.minute  < 10){
       minI = '0' + impdHorInix.minute;
     }   
     let impHorIni =  horaI + ':' + minI;  
     let impdDefectox = impdDefecto.split(',');  
     let inyeccion ={impdHorIni: impHorIni , impdPesoCaja:impdPesoCaja , impdCajaAcu:impdCajaAcu , impdDefecto:impdDefectox[1] ,impdidMot:impdDefectox[0] , impdEst : 'P'} ;
     this.impDet.push(inyeccion);
     this.modal.dismissAll();  
     this.insImpDet.reset(); 
   }


  delPrd(index:any , termo:any){
      this.impDet.splice(index , 1);
  }


  insCtlProd(modalInsCtl : any){
    this.modal.open(modalInsCtl , {size:'lg'});
  }

  terminar(content : any){  
     this.modal.open(content , {size:'lg'});
  }

  

 
   delTinta(index:any ){
     this.impTinta.splice(index , 1);    
   }
 
   insTinta(imptPrd : any){   
    let imptPrdx = imptPrd.impPrdTinta.split(',');  
    let tinta    = {'idPrd':imptPrdx[0] ,'imptPrdDes' : imptPrdx[1] , 'impPrdCod' :  imptPrdx[2] , 'imptPrdLote' : imptPrd.impPrdLote};
    this.impTinta.push(tinta);
   }
 

 insTermCierre(impReproceso:any, impBasura:any,impMerma:any){
    this.val      = true;
    this.serviLoad.sumar.emit(1);   
    let par : any = [{'id': this.idImp, 'impReproceso' : impReproceso , 'impBasura' : impBasura , 'impMerma': impMerma ,'impDet': this.impDet ,'impTinta': this.impTinta}];
    this.serviRest.post('insImpCierre', this.token, par).subscribe(resp => {
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> {
              const d = 'impresion';
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
  