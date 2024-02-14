import { merge, Observable } from 'rxjs';
import { Subject, OperatorFunction } from 'rxjs';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/servicios/excel.service';
import { distinctUntilChanged, debounceTime, filter, map } from 'rxjs/operators';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { LinksService } from 'src/app/servicios/links.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { TareasService } from 'src/app/servicios/tareas.service';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-trab-orden-impresion',
  templateUrl: './trab-orden-impresion.component.html',
  styleUrls: ['./trab-orden-impresion.component.css']
})
export class TrabOrdenImpresionComponent implements OnInit {
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
  impDet       : any[]                = [];
  imprePeso    : any[]                = [];
  impTinta     : any[]                = [];
  tipoAction   : string               = '';
  url          : string               = '';
  impresion    : any                  = {};
  idImp        :number                = 0;

  constructor(private servicio     : UsersService,
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
      this.servicioget.get('trabOtImp' , this.token, parm).subscribe(respuesta => {
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
    this.servicioget.get('trabOtImp' , this.token, this.parametros).subscribe(respuesta => {
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

     this.servicioget.get('trabOtImp' , this.token, this.parametros).subscribe(respuesta => {
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
      this.excel.exportAsExcelFile(this.tblOrdenPrd, 'impresion');
      return false;
  }

  public insImp(impresion : any){
    if(impresion.estado_inye_ctl == 'PENDIENTE'  || impresion.estado_inye_ctl  == null){
      this.servicioTarea.setExtrusion(impresion);   
      if(impresion.lote_salida){
        this.servicioLink.disparador.emit('upImp');
      }else{         
        this.servicioLink.disparador.emit('insImp');
      }

    }else{
      if(impresion.estado_inye_ctl == 'APROBADA'){
        this.servicioAlert.setAlert('La impresión ya fue autorizada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        this.servicioAlert.setAlert('La impresión ya fue rechazada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }
    }
    
  }

  public upImp( impresion : any){   
    if(impresion.estado_termo_ctl == 'PENDIENTE' || impresion.estado_termo_ctl  == null ){
      this.servicioTarea.setExtrusion(impresion);
      this.servicioLink.disparador.emit('upcImp');
    }else{
      if(impresion.estado_termo_ctl == 'APROBADA'){
        this.servicioAlert.setAlert('La impresión ya fue autorizada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        this.servicioAlert.setAlert('La impresión ya fue rechazada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }
    }
      
  }

  public verImp(inyeccion : any , content:any){    
        this.orden_trabajo= {};
        this.impDet       = [];        
        this.imprePeso    = [];     
        
         this.orden_trabajo = inyeccion;    
         let impLotSal      = this.orden_trabajo.lote_salida;
    
         this.parametros = [{"key": "impLotSal" , "value" :impLotSal}];  
         this.servicioget.get('impresion', this.token , this.parametros).subscribe((data:any) => {     
          this.impresion = data.impresion;
          this.impDet    = data.impresionDet;
          this.impTinta  = data.impTinta;
          this.imprePeso = data.impPeso;    
          this.impresion.forEach((element: any) => {
            this.idImp     = element.idImp;                
            if(this.idImp > 0){
              this.carga    = 'visible';
              this.loading  = false;
              this.val      = false;
            }
          });
        });
        this.modal.open(content, {size:'xl'}); 
  }

 
 
 public accionImp(content:any, tipo : any , impresion : any){
  
   if(impresion.estado_impre_ctl == 'PENDIENTE' && impresion.lote_salida != null){
      this.impresion = {};
      this.url   = '';
      this.impresion = impresion;
    
        if(tipo == 'A'){
          this.tipoAction = 'Autorización';
          this.url        = 'impConf';
        }else{
          //termRechazo
          this.tipoAction = 'Rechazo';
          this.url        = 'impRechazo';
        }
        this.orden_trabajo  = {};
        this.impDet         = [];           
         this.orden_trabajo = impresion;        
         let impLotSal      = this.orden_trabajo.lote_salida;
      
         this.parametros = [{"key": "impLotSal" , "value" :impLotSal}];  
         this.servicioget.get('impresion', this.token , this.parametros).subscribe((data:any) => {     
          
          this.impDet    = data.impresionDet;
          this.impTinta  = data.impTinta;
          this.imprePeso = data.impPeso;    
         
        });
    
        this.modal.open(content, {size:'xl'}); 

    }else{
      if(impresion.lote_salida == null){
        this.servicioAlert.setAlert('Sin registro operacionales', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        if(this.orden_trabajo.estado_impre_ctl == 'APROBADA'){
          this.servicioAlert.setAlert('La impresión ya fue autorizada', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
        }else{
          this.servicioAlert.setAlert('La impresión ya fue rechazada', 'danger');
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
  
}

