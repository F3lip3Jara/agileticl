import { TareasService } from './../../../../servicios/tareas.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AlertasService } from './../../../../servicios/alertas.service';
import { LinksService } from './../../../../servicios/links.service';
import { ExcelService } from './../../../../servicios/excel.service';
import { RestService } from './../../../../servicios/rest.service';
import { UsersService } from './../../../../servicios/users.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, OperatorFunction, Observable, merge } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TermoDet } from 'src/app/model/termoDet.model';
import { saveAs} from 'file-saver';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-trab-orden-inyeccion',
  templateUrl: './trab-orden-inyeccion.component.html',
  styleUrls: ['./trab-orden-inyeccion.component.css']
})
export class TrabOrdenInyeccionComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;
  @ViewChild("orpNumRea")  orpNumRea? : ElementRef;
  @ViewChild('instance', {static: true}) instance?: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  dtOptions    : DataTables.Settings  = {} ;
  loading      : boolean              = true;
  tblOrdenPrd  : any                  = {};
  producto     : any                  = {};
  filtroOp     : FormGroup;
  token        : string               = '';
  parametros   : any []               = [];
  statesx      : any                  ;
  states       : string[]             = [];
 // upPrd        : FormGroup             ;
  carga        : string              = "invisible";
  model        : any;
  xorden       : any;
  xorddet      : any                  = {};
  ot           : any []               = [];
  val          : boolean              = false;
  orden_trabajo: any                  ={};
  inyDet     : any[]                = [];
  inyDetC    : any[]                = [];
  inyPeso    : any[]                = [];
  inyArchivo : any[]                = [];
  tipoAction   : string               = '';
  url          : string               = '';
  inyeccion    : any                  = {};

  constructor(private servicio     : UsersService ,
              private servicioget  : RestService,
              private fb           : FormBuilder,
              private excel        : ExcelService,
              private servicioLink : LinksService,
              private servicioAlert: AlertasService,
              private servicioTarea: TareasService,
              private modal        : NgbModal,
              private serviLoad    : LoadingService
               ) {

                this.filtroOp = fb.group({
                  orpNumRea : ['']
                });
                this.token = this.servicio.getToken();
                }
                search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
                  const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
                  const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
                  const inputFocus$ = this.focus$;

                  return merge(debouncedText$, inputFocus$ ,clicksWithClosedPopup$).pipe(
                  map(term  => (term === '' ? this.states
                  : this.states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
                  );
                }

  ngOnInit(): void {

    this.tblData();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      lengthMenu : [20,50,100, 200],

      processing: true,
      language: {
        emptyTable: '',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        }
      }}
      this.parametros = [];
      this.servicioget.get('opNumRea' , this.token, this.parametros).subscribe(data => {
        this.statesx = data;
       this.statesx.forEach((element: any) => {
         this.states.push(element.orpNumRea);
       });

     });
     this.serviLoad.sumar.emit(2);
  }


  public buscar(orpNumRea : string ){
    if (orpNumRea){
      this.loading      = true;
      let parm : any[]  = [{key :'orpNumRea' ,value: orpNumRea} ];
      this.tblOrdenPrd = {};
      this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
          dtInstance.destroy().draw();
        });
      this.servicioget.get('trabOtInye' , this.token, parm).subscribe(respuesta => {
          this.tblOrdenPrd = respuesta;
          this.loading      = false;
         });
    }else{
      this.servicioAlert.setAlert('Debe ingresar un filtro', 'warning');
      this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      setTimeout(()=> {
        this.servicioAlert.setAlert('', '');
     },2000 );
    }
  }


  public tblData(){
    this.tblOrdenPrd = {};
    this.servicioget.get('trabOtInye' , this.token, this.parametros).subscribe(respuesta => {
      this.tblOrdenPrd = respuesta;
     });

     setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );

  }

  public refrescar(){
     this.loading       = true;
     this.carga         = 'invisible';
     this.tblOrdenPrd   = {};

     this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
      dtInstance.destroy().draw();
    });

     this.servicioget.get('trabOtInye' , this.token, this.parametros).subscribe(respuesta => {
       this.tblOrdenPrd = respuesta;
       setTimeout(()=> {
        this.loading = false;
        this.carga   = 'visible';
      },1000);
    });
    this.filtroOp = this.fb.group({
      orpNumRea : [''],
      });
  }

  public Excel(){
      this.excel.exportAsExcelFile(this.tblOrdenPrd, 'inyeccion');
      return false;
  }

  public insInye(inyeccion : any){
    if(inyeccion.estado_inye_ctl == 'PENDIENTE'  || inyeccion.estado_inye_ctl  == null){
      this.servicioTarea.setExtrusion(inyeccion);   
      if(inyeccion.lote_salida){
        this.servicioLink.disparador.emit('upInye');
      }else{         
        this.servicioLink.disparador.emit('insInye');
      }

    }else{
      if(inyeccion.estado_inye_ctl == 'APROBADA'){
        this.servicioAlert.setAlert('La inyección ya fue autorizada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        this.servicioAlert.setAlert('La inyección ya fue rechazada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }
    }
    
  }

  public upIny( inyeccion : any){   
    if(inyeccion.estado_inye_ctl == 'PENDIENTE' || inyeccion.estado_inye_ctl  == null ){
      this.servicioTarea.setExtrusion(inyeccion);
      this.servicioLink.disparador.emit('upcInye');
    }else{
      if(inyeccion.estado_inye_ctl == 'APROBADA'){
        this.servicioAlert.setAlert('La inyección ya fue autorizada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        this.servicioAlert.setAlert('La inyeccion ya fue rechazada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }
    }
      
  }

  public verIny(orden: any , content:any){ 
    this.orden_trabajo = orden;
    this.modal.open(content, {size:'xl'}); 
  }

 
  downloadDoc(nombre:any){  
    this.parametros = [{key:'archivo' , value : nombre },{ key: 'tipo' , value : 'inyeccion'}];
    this.servicioget.get('archivos', this.token , this.parametros).subscribe((data:any) => {     
      console.log(data);    
      window.open(data.url,'_blank');
    });
  }


 public accionIny(content:any, tipo : any , inyeccion : any){
    if(inyeccion.estado_inye_ctl == 'PENDIENTE' && inyeccion.lote_salida != null){
      this.inyeccion = {};
      this.url   = '';
      this.inyeccion = inyeccion;
    
        if(tipo == 'A'){
          this.tipoAction = 'Autorización';
          this.url        = 'inyConf';
        }else{
          //termRechazo
          this.tipoAction = 'Rechazo';
          this.url        = 'inyRechazo';
        }
        this.orden_trabajo = {};
        this.inyDet        = [];
        this.inyDetC       = [];
        this.inyPeso       = [];
        this.inyArchivo    = [];
        
         this.orden_trabajo = inyeccion;        
         let inyLotSal      = this.orden_trabajo.lote_salida;
      
         this.parametros = [{"key": "inyLotSal" , "value" :inyLotSal} , {"key":"idIny" , "value" : this.orden_trabajo.id_inye }];  
         this.servicioget.get('inyeccion', this.token , this.parametros).subscribe((data:any) => {     
           this.inyeccion = data.inyeccion;
           this.inyDet = data.inyeccionDet;           
     
           data.inyeccionDetC.forEach((element:any) => {
             let inyeccion ={ inydHorIni: element.inydHorIni, inydRechazo: element.inydRechazo , inydLimp:element.inydLimp , inydObs:element.inydObs , inydDefecto:element.inydDefecto ,inydidMot:element.inydidMot , inydEst : element.inydEst} ;
             this.inyDetC.push(inyeccion);
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
    
        this.modal.open(content, {size:'xl'}); 

    }else{
      if(inyeccion.lote_salida == null){
        this.servicioAlert.setAlert('Sin registro operacionales', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        if(inyeccion.estado_inye_ctl == 'APROBADA'){
          this.servicioAlert.setAlert('La inyección ya fue autorizada', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
        }else{
          this.servicioAlert.setAlert('La inyección ya fue rechazada', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
        }
      }
     
    }
  }

  public action(){     
    let par : any = [{'lote_salida': this.orden_trabajo.lote_salida , 'idOrdt': this.orden_trabajo.op}];
    this.val      = true;
    this.loading  = true;   
    this.servicioget.post( this.url, this.token, par).subscribe(resp => {
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
              this.modal.dismissAll();       
              this.loading  = false;
              this.val      = false;
              this.tblData();
          }else{
            this.carga    = 'visible';
            this.loading  = false;
            this.val      = false;
          }
       });
    });
    this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
  }
/*
  public Envasado(content : any , inyeccion : any){

    if(inyeccion.estado_termo_ctl == 'APROBADA'){

    this.parametros = [{key:'id' , value : inyeccion.id_termo}];   
   
    this.servicioget.get('valEnv', this.token , this.parametros).subscribe((data:any) => { 
      if(data > 0){    
        this.servicioAlert.setAlert('La inyección ya fue enviado a envasado', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
       }else{      
        this.tipoAction    = "Generar Envasado"
        this.orden_trabajo = inyeccion;
        this.modal.open(content);
       }
    });
  }else{
    this.servicioAlert.setAlert('La inyección no se encuentra aprobado', 'danger');
    this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
  }
 }
*/
 
}
