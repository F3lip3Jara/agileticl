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
import { TermoDet } from 'src/app/model/termoDet.model';

@Component({
  selector: 'app-up-termoformado-c',
  templateUrl: './up-termoformado-c.component.html',
  styleUrls: ['./up-termoformado-c.component.css']
})
export class UpTermoformadoCComponent implements OnInit {

  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible"; 
  insCtl       : FormGroup;
  insArch      : FormGroup;
  extLotSal    : string               = '';
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
  termoformado : any                  = {};
  rechazo      : any                  = {};
  termoDet     : any[]                = [];
  termoDetC    : any[]                = [];
  termoPeso    : any[]                = [];
  termoArchivo : any[]                = [];
  myReader     : FileReader                 = new FileReader();
  insTermDet   : FormGroup;
  
  
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
                this.terLotSal     = this.orden_trabajo.lote_salida;
                
                this.insArch = fg.group({
                  archivos    : ['', Validators.compose([
                    Validators.required,
                    ])]
                });

                this.insCtl = fg.group({
                  terObs: ['', Validators.compose([             
                  ])]
                });

                this.insTermDet= fg.group({ 
                  terdDefecto    : ['', Validators.compose([
                  Validators.required,
                  ])],
                  terdRechazo    : ['', Validators.compose([
                    Validators.required
                    ])],
                    terdSani    : ['', Validators.compose([
                      Validators.required
                  ])],
                  terdPesoUn    : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                   ])],
                });
   }

  ngOnInit(): void {
    this.parametros = [{key:'terLotSal' , value : this.terLotSal}];    
    this.serviRest.get('termoformado', this.token , this.parametros).subscribe((data:any) => {     
      this.termoformado = data.termoformado;
      this.termoformado.forEach((element: any) => {
        this.idTer     = element.idTer;  
      });

      data.termoPeso.forEach((element :any) => {
        let pesos = {'terpPeso' : element.terpPeso,'terptip' : element.terptip};
        this.termoPeso.push(pesos);
      });
      data.termoDet.forEach((element:any)=>{
        let termo = new TermoDet(this.idTer, element.terdEst, element.terdHorIni,'',element.terdLotExt, element.peso , element.ancho , element.espesor, element.terdCaja, element.terdPesoUn,element.terdTem,element.terdTipo);
        this.termoDet.push(termo);
      });

      data.termoDetC.forEach((element:any)=>{
        let termo = {"idTer" : this.idTer , "terdHorIni" : element.terdHorIni , "terdDefecto": element.terdDefecto ,"terdRechazo": element.terdRechazo, "terdSani": element.terdSani , "terdPesoUn" : element.terdPesoUn  , "terdidMot" : element.terdidMot}
        this.termoDetC.push(termo);
      })
      data.termoArch.forEach((element:any)=>{
        let archivo = {'nombre' : element.terarlink};
        this.termoArchivo.push(archivo);
      })
    });

    this.parametros = [];

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
    this.parametros = [{key:'idEta' , value : 5}];
    this.serviRest.get('filEta', this.token , this.parametros).subscribe(data => {
      this.maquinas = data;
    });

    this.serviRest.get('prodInsumo', this.token , this.parametros).subscribe(data => {
      this.insumos = data;
    });    
    let etapas      = [5];   
    this.parametros = [{"key": "etapas" , "value" :etapas}];  
    this.serviRest.get('motEta', this.token , this.parametros).subscribe(data =>{
      this.rechazo = data
    });
    this.serviLoad.sumar.emit(5);
  }

  volver(){
    const d = 'Ot_Ter';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  delPrd(index:any){
    this.termoDetC.splice(index , 1);
  }

  insCtlPeso(content : any){
    this.modal.open(content);
  }

  insPesos(terpPeso : any){
    let pesos = {'terpPeso' : terpPeso,'terptip' : 'C'};
    this.termoPeso.push(pesos);
  }

  delPeso(index:any){
    this.termoPeso.splice(index , 1);
  }

  delArch(index:any , archivo : any){
    this.termoArchivo.splice(index , 1);
    let parm = [{'idTer' : this.idTer , 'archivo': archivo}];
    this.serviRest.post('delTermArcv', this.token, parm).subscribe(resp => {
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

  terminar(content : any){
    this.modal.open(content , {size:'lg'});   
  }

  insTermCierre(terObs:any){
    this.val      = true;
    this.serviLoad.sumar.emit(1);   
    let par : any = [{'id': this.idTer, 'terObs' : terObs , 'termoPeso' : this.termoPeso , 'termoDetC': this.termoDetC}];
    this.serviRest.post('insTermCierreC', this.token, par).subscribe(resp => {
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> {
              const d = 'Ot_Ter';
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

  public insArchivos(archivo : any){
    let archivos = {'nombre': archivo.nombre , 'base64': archivo.base64 , 'idTer': this.idTer}; 
        this.serviRest.post('uploadArTer', this.token, archivos).subscribe(resp => {     
        resp.forEach((elementx : any)  => {
          if(elementx.error == '0'){
              this.isEnabled  = true;       
              setTimeout(()=> {
               this.modal.dismissAll(); 
               this.termoArchivo.push(archivos);  
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

  public insTerm(content : any){
      this.insCtl.reset();
      this.modal.open(content);
    
  } 

  public insTerCtlCal( terdDefectox:any ,terdRechazo:any,terdSani:any,terdPesoUn:any){
    let terdDefecto = terdDefectox.split(',');            
    this.todayWithPipe = this.pipe.transform(Date.now(), 'HH:mm');
    let termox = {"terdHorIni" : this.todayWithPipe , "terdDefecto": terdDefecto[1] , "terdidMot" : terdDefecto[0] ,"terdRechazo":terdRechazo, "terdSani": terdSani , "terdPesoUn" : terdPesoUn }
    this.insTermDet.reset();
    this.modal.dismissAll();
    this.termoDetC.push(termox);    
  }

  public insTerCtlC(content : any){
    this.modal.open(content);
  }

}
