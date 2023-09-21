import { TareasService } from './../../../../../servicios/tareas.service';
import { LoadingService } from './../../../../../servicios/loading.service';
import { AlertasService } from './../../../../../servicios/alertas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from './../../../../../servicios/rest.service';
import { LinksService } from './../../../../../servicios/links.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-ins-inyeccion',
  templateUrl: './ins-inyeccion.component.html',
  styleUrls: ['./ins-inyeccion.component.css']
})
export class InsInyeccionComponent implements OnInit {
  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible";
  insIny       : FormGroup;  
  extLotSal    : string               = '';
  insInyDet    : FormGroup;
  insCtl       : FormGroup;
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
  inyLotSal    : string               = '';
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
  termoPeso    : any[]                = [];
  pallet       : any                  = {};
  valCaja      : boolean              = false;
  textoControl : string               ='';
  rechazo      : any                  = {};
    
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

                this.insIny= fg.group({
                  inyMaq    : ['', Validators.compose([
                  Validators.required,
                  ])],                 
                  inyPrdCaja : ['', Validators.compose([
                    Validators.required,
                      ])],
                  inyPrdBolsa : ['', Validators.compose([
                        Validators.required,
                        ])],
                  inyLotCaja : ['', Validators.compose([
                    Validators.required,
                        ])],
                  inyLotBolsa : ['', Validators.compose([
                          Validators.required,
                  ])],
                  extMez: ['', Validators.compose([
                    Validators.required,
                   ])],

                  inyTurn: ['', Validators.compose([
                    Validators.required,
                   ])],
                });

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

               this. insCtl= fg.group({ 
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

    this.parametros = [{key:'idEta' , value : 7}];
    this.serviRest.get('filEta', this.token , this.parametros).subscribe(data => {
      this.maquinas = data;
    });
   /* this.serviRest.get('prodInsumo', this.token , this.parametros).subscribe(data => {
      this.insumos = data;
    });    */
    this.serviRest.get('getSacaBins', this.token , this.parametros).subscribe(data => {
      this.sacas = data;    
    });
    let etapas      = [7];   
    this.parametros = [{"key": "etapas" , "value" :etapas}];  
    this.serviRest.get('motEta', this.token , this.parametros).subscribe(data =>{
      this.rechazo = data;   
    });
    this.serviLoad.sumar.emit(5);

  }

  insInyeccion(inyMaq:any ,  inyPrdCaja:any , inyPrdBolsa:any ,inyLotCaja:any ,inyLotBolsa:any, inyTurn:any , extMez:any){
    this.serviLoad.sumar.emit(1);
    this.parametros  = [];
    this.parametros  = [{'idIny': this.orden_trabajo.id_inye, 'idOt': this.orden_trabajo.id , 'inyMaq' : inyMaq , 'inyPrdCaja' : inyPrdCaja , 'inyPrdBolsa' : inyPrdBolsa, 'inyLotCaja': inyLotCaja, 'inyLotBolsa': inyLotBolsa , 'inyTurn' : inyTurn , 'extMez' : extMez , 'inyDia' : this.diaJul} ] ;
    this.serviRest.post('insIny', this.token, this.parametros).subscribe(resp => {
      this.val = true;
      resp.forEach((elementx : any)  => {
      if(elementx.error == '0'){
          this.isEnabled  = true;
          console.log(elementx.data);
          let datos       = elementx.data;
          datos.forEach((element : any) => {
              console.log(element);
              this.inyLotSal = element.inyLotSal;
              this.idIny     = element.idIny;
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
    const d = 'inyeccion';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  insCtlProd(modalInsCtl : any){
    this.modal.open(modalInsCtl , {size:'lg'});
  }

 insInyDetalle(inydHorInix : any ,inydConmutacion:any , inydPesoCaja : any ,  inydCaja:any, inydDefecto:any){
   let horaI      = inydHorInix.hour; 
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

  delPrd(index:any, termo:any){
   this.inymoDet.splice(index , 1);
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
 selProducto (event : any){
    this.insIny.controls['inyPrdCaja'].setValue(event.idPrd);       
  }

  selProducto2 (event : any){
    this.insIny.controls['inyPrdBolsa'].setValue(event.idPrd);
    
  }

}
