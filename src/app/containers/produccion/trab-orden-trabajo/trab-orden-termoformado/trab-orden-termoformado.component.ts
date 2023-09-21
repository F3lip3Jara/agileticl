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
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-trab-orden-termoformado',
  templateUrl: './trab-orden-termoformado.component.html',
  styleUrls: ['./trab-orden-termoformado.component.css']
})
export class TrabOrdenTermoformadoComponent implements OnInit {
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
  tipoAction   : string               = '';
  url          : string               = '';
  termo        : any                  = {};

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
      this.servicioget.get('trabOtTermofil' , this.token, parm).subscribe(respuesta => {
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
    this.servicioget.get('trabOtTermo' , this.token, this.parametros).subscribe(respuesta => {
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

     this.servicioget.get('trabOtTermo' , this.token, this.parametros).subscribe((respuesta:any) => {
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
      this.excel.exportAsExcelFile(this.tblOrdenPrd, 'termoformado');
      return false;
  }

  public insTermo(termoformado : any){
    if(termoformado.estado_termo_ctl == 'PENDIENTE'  || termoformado.estado_termo_ctl  == null){
      this.servicioTarea.setExtrusion(termoformado);   
      if(termoformado.lote_salida){
        this.servicioLink.disparador.emit('upTermo');
      }else{         
        this.servicioLink.disparador.emit('insTermo');
      }

    }else{
      if(termoformado.estado_termo_ctl == 'APROBADA'){
        this.servicioAlert.setAlert('El termoformado ya fue autorizada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        this.servicioAlert.setAlert('El termoformado ya fue rechazada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }
    }
    
  }

  public upTermo( termoformado : any){   
    if(termoformado.estado_termo_ctl == 'PENDIENTE' || termoformado.estado_termo_ctl  == null ){
      this.servicioTarea.setExtrusion(termoformado);
      this.servicioLink.disparador.emit('calTermo');
    }else{
      if(termoformado.estado_termo_ctl == 'APROBADA'){
        this.servicioAlert.setAlert('El termoformado ya fue autorizada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        this.servicioAlert.setAlert('El termoformado ya fue rechazada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }
    }
      
  }

  public verTermo(termoformado : any , content:any){    
    this.orden_trabajo = {};   
     this.orden_trabajo = termoformado;
    this.modal.open(content, {size:'xl'});    
  }

 
  downloadDoc(nombre:any){  
    this.parametros = [{key:'archivo' , value : nombre },{ key: 'tipo' , value : 'termoformado'}];
    this.servicioget.get('archivos', this.token , this.parametros).subscribe((data:any) => {     
      console.log(data);    
      window.open(data.url,'_blank');
    });
  }

 public accionTermo(content:any, tipo : any , termoformado : any){
    if(termoformado.estado_termo_ctl == 'PENDIENTE' && termoformado.lote_salida != null ){
      this.termo = {};
      this.url   = '';
      this.termo = termoformado;    
        if(tipo == 'A'){
          this.tipoAction = 'Autorización';
          this.url             = 'termConf';
        }else{
          //termRechazo
          this.tipoAction   = 'Rechazo';
          this.url               = 'termRechazo';
        }         
         this.orden_trabajo = termoformado;    
        this.modal.open(content, {size:'xl'}); 
    }else{
      if(termoformado.lote_salida == null ){
        this.servicioAlert.setAlert('Sin datos operacionales', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        if(termoformado.estado_termo_ctl == 'APROBADA'){
          this.servicioAlert.setAlert('El termoformado ya fue autorizada', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
        }else{
          this.servicioAlert.setAlert('El termoformado ya fue rechazada', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
        }
      }
     
    } 
  }

  public action(){   
    let par : any = [{'lote_salida': this.termo.lote_salida , 'idOrdt': this.termo.id}];
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

  public Envasado(content : any , termoformado : any){

    if(termoformado.estado_termo_ctl == 'APROBADA'){
    this.parametros = [{key:'id' , value : termoformado.id_termo}];      
    this.servicioget.get('valEnv', this.token , this.parametros).subscribe((data:any) => { 
      if(data > 0){    
        this.servicioAlert.setAlert('El termoformado ya fue enviado a envasado', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
       }else{      
        this.tipoAction    = "Generar Envasado"
        this.orden_trabajo = termoformado;
        this.modal.open(content);
       }
    });
  }else{
    this.servicioAlert.setAlert('El termoformado no se encuentra aprobado', 'danger');
    this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
  }
 }

  public gerEnvasado(){   
    let par : any = {'orden': this.orden_trabajo };
    this.val      = true;
    this.servicioget.post('insEnv', this.token, par).subscribe(resp => {
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){           
            setTimeout(()=> {           
              this.modal.dismissAll();       
              },1000 );
              this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
              this.val = false;
          }              
       });
    });       
  }
}
   

