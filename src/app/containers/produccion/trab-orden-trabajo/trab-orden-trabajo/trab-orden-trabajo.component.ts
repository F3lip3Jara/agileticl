import { merge, Observable } from 'rxjs';
import { AlertasService } from '../../../../servicios/alertas.service';
import { LinksService } from '../../../../servicios/links.service';
import { RestService } from '../../../../servicios/rest.service';
import { UsersService } from '../../../../servicios/users.service';
import { Subject, OperatorFunction } from 'rxjs';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/servicios/excel.service';
import { distinctUntilChanged, debounceTime, filter, map } from 'rxjs/operators';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-trab-orden-trabajo',
  templateUrl: './trab-orden-trabajo.component.html',
  styleUrls: ['./trab-orden-trabajo.component.css']
})
export class TrabOrdenTrabajoComponent implements OnInit {


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
  filtroOp     : UntypedFormGroup;
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
  orden        : any                  = {};
  idEta        : number               =  0;
  tipo         : string               = '';
  url          : string               = '';
  tipoAction   : string               = '';

  constructor(private servicio    : UsersService ,
              private servicioget : RestService,
              private fb          : UntypedFormBuilder,
              private excel       : ExcelService,
              private servicioLink: LinksService,
              private servicioAlert: AlertasService,
              private modal        : NgbModal,
              private serviLoad    : LoadingService) {

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


  }
  public buscar(orpNumRea : string ){
    if (orpNumRea){
      this.loading      = true;
      let parm : any[]  = [{key :'orpNumRea' ,value: orpNumRea} ];
      this.tblOrdenPrd = {};
      this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
          dtInstance.destroy().draw();
        });
      this.servicioget.get('filotNumRea' , this.token, parm).subscribe(respuesta => {
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
    this.servicioget.get('trabOt' , this.token, this.parametros).subscribe(respuesta => {
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
     this.servicioget.get('trabOt' , this.token, this.parametros).subscribe(respuesta => {
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
      this.excel.exportAsExcelFile(this.tblOrdenPrd, 'producto');
      return false;
  }

  agregar(orden:any , content:any){
    if(orden.estado == 'PENDIENTE'){
    this.orden = orden;
    this.modal.open(content, {size:'xs'}); 
    this.val  = false;
  }{
    if(orden.estado == 'APROBADA'){
      this.servicioAlert.setAlert('La orden ya fue autorizada', 'danger');
      this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
    }else{
      this.servicioAlert.setAlert('La orden ya fue rechazada', 'danger');
      this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
    }
  }
  }

  genrarOT(orden : any){

    this.serviLoad.sumar.emit(1);  
    this.servicioget.post('insOTT', this.token, orden).subscribe(resp => {
      this.val = true;
      resp.forEach((elementx : any)  => {
      if(elementx.error == '0'){        
          setTimeout(()=> {
            this.val= false;
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

  verOT(orden: any , content : any){
    this.orden = orden;
    this.modal.open(content , {'size': 'xl'});
    this.idEta = orden.cod_etapa;
  }

  public mAprOT( content : any , tipo: any , orden: any){
    if(orden.estado == 'PENDIENTE'){
      this.orden = {};
      this.url   = '';
      this.orden = orden;    
        if(tipo == 'A'){
          this.tipoAction = 'Autorización';
          this.url        = 'AprOt';
        }else{
          //termRechazo
          this.tipoAction   = 'Rechazo';
          this.url          = 'RecOt';
        }     
        this.modal.open(content, {size:'xl'}); 
    }else{
     
        if(this.orden.estado == 'APROBADA'){
          this.servicioAlert.setAlert('La orden ya fue autorizada', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
        }else{
          this.servicioAlert.setAlert('La orden ya fue rechazada', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
        }
      }
    
  }

  AprOT(orden: any ){
    this.serviLoad.sumar.emit(1);  
    this.servicioget.post(this.url, this.token, orden).subscribe(resp => {
      this.val = true;
      resp.forEach((elementx : any)  => {
      if(elementx.error == '0'){   
        this.modal.dismissAll();       
          setTimeout(()=> {
            this.tblData();
  
            this.carga    = 'visible';
            this.val= false;
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
