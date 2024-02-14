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
  selector: 'app-ins-impresion',
  templateUrl: './ins-impresion.component.html',
  styleUrls: ['./ins-impresion.component.css']
})
export class InsImpresionComponent implements OnInit {

  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible";
  insImp       : FormGroup;  
  impLotSal    : string               = '';
  insImpDet    : FormGroup;
  insCtl       : FormGroup;
  token        : string               = '';
  bins        : any ;
  parametros   : any []               = [];
  producto     : any                  = {};
  val          : boolean              = false;
  fechaS       : string               = '';
  config       :any                   = {};
  maquinas     : any ;
  valGuar      : boolean              = false;
  diaJul       : any;
  isEnabled    : boolean              = false;
  inyLotSal    : string               = '';
  idImp        : number               = 0;
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
  impDet       : any[]                = [];
  impPeso      : any[]                = [];
  
  pallet       : any                  = {};
  valCaja      : boolean              = false;
  textoControl : string               ='';
  rechazo      : any                  = {};
  imprePeso    : any[]                = [];
  impTinta     : any[]                = [];
  
    
  constructor( private servicioLink : LinksService,
               private serviRest    : RestService,
               private servicio     : UsersService,
               private modal        : NgbModal,
               private fg           : FormBuilder,
               private servicioAlert: AlertasService,
               private serviLoad    : LoadingService,
               private serTareas    : TareasService

               ) {
                this.bins         = {};
                this.insumos       = {};
                this.maquinas      = {};               
                this.token         = this.servicio.getToken();
                this.orden_trabajo = this.serTareas.getExtrusion();

                this.insImp= fg.group({
                  impMaq    : ['', Validators.compose([
                  Validators.required,
                  ])],                 
                  impPrdCaja : ['', Validators.compose([
                    Validators.required,
                      ])],
                  impPrdBolsa : ['', Validators.compose([
                        Validators.required,
                        ])],
                  impLotCaja : ['', Validators.compose([
                    Validators.required,
                        ])],
                  impLotBolsa : ['', Validators.compose([
                          Validators.required,
                  ])],
                  extMez: ['', Validators.compose([
                    Validators.required,
                   ])],

                  impTurn: ['', Validators.compose([
                    Validators.required,
                   ])],
                });

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
   
    let etapas      = [8];   
    this.parametros = [{"key": "etapas" , "value" :etapas}];  
    this.serviRest.get('motEta', this.token , this.parametros).subscribe(data =>{
      this.rechazo = data;   
    });
    this.serviLoad.sumar.emit(5);

  }

  insInyeccion(impMaq:any ,  impPrdCaja:any , impPrdBolsa:any ,impLotCaja:any ,impLotBolsa:any, impTurn:any , extMez:any){
    this.serviLoad.sumar.emit(1);
    this.parametros  = [];
    this.parametros  = [{'idImp': this.orden_trabajo.id_impre,'idOt': this.orden_trabajo.id, 'idOrdtd': this.orden_trabajo.id_det , 'impMaq' : impMaq , 'impPrdCaja' : impPrdCaja , 'impPrdBolsa' : impPrdBolsa, 'impLotCaja': impLotCaja, 'impLotBolsa': impLotBolsa , 'impTurn' : impTurn , 'extMez' : extMez , 'impDia' : this.diaJul} ] ;
    this.serviRest.post('insImp', this.token, this.parametros).subscribe(resp => {
      this.val = true;
      resp.forEach((elementx : any)  => {
      if(elementx.error == '0'){
          this.isEnabled  = true;
          console.log(elementx.data);
          let datos       = elementx.data;
          datos.forEach((element : any) => {
              console.log(element);
              this.impLotSal = element.impLotSal;
              this.idImp     = element.idImp;
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
    const d = 'impresion';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  insCtlProd(modalInsCtl : any){
    this.modal.open(modalInsCtl , {size:'lg'});

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

  delPrd(index:any, inyeccion:any){
   this.impDet.splice(index , 1);
   }


  delTinta(index:any ){
    this.impTinta.splice(index , 1);    
  }

  insTinta(imptPrd : any){   
    let imptPrdx = imptPrd.impPrdTinta.split(',');  
    let tinta    = {'idPrd':imptPrdx[0] ,'imptPrdDes' : imptPrdx[1] , 'impPrdCod' :  imptPrdx[2] , 'imptPrdLote' : imptPrd.impPrdLote};
    this.impTinta.push(tinta);  
   }

  

  terminar(content : any){
    this.modal.open(content , {size:'lg'});
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

  selTermoformado(event : any){
   console.log(event);
   this.insImp.controls['extMez'].setValue(event.id_termo)
  }

  selProducto (event : any){
    this.insImp.controls['impPrdCaja'].setValue(event.idPrd);       
  }

  selProducto2 (event : any){
    this.insImp.controls['impPrdBolsa'].setValue(event.idPrd);
    
  }
}
