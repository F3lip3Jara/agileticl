import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { saveAs} from 'file-saver';
import { Subject, OperatorFunction, Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LinksService } from 'src/app/servicios/links.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { TareasService } from 'src/app/servicios/tareas.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-trab-orden-envasado',
  templateUrl: './trab-orden-envasado.component.html',
  styleUrls: ['./trab-orden-envasado.component.css']
})
export class TrabOrdenEnvasadoComponent implements OnInit {

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
  insArch      : FormGroup;
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
  orden_trabajo: any                  = {};
  envDet       : any[]                = [];
  envArchivo   : any[]                = [];
  tipoAction   : string               = '';
  url          : string               = '';
  termo        : any                  = {};
  nombreArch   : string               = '';
  arhivosTer   : any ;
  myReader     : FileReader           = new FileReader();
  isEnabled    : boolean              = false;

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

                this.insArch = fb.group({
                  archivos    : ['', Validators.compose([
                    Validators.required,
                    ])]
                });


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
    this.servicioget.get('trabOtEnv' , this.token, this.parametros).subscribe(respuesta => {
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
     this.servicioget.get('trabOtEnv' , this.token, this.parametros).subscribe(respuesta => {
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
      this.excel.exportAsExcelFile(this.tblOrdenPrd, 'envasado');
      return false;
  }

  public insEnvasado(envasado : any){  
    if(envasado.estado_termo_ctl == 'PENDIENTE' || envasado.estado_termo_ctl  == null){
      this.servicioTarea.setExtrusion(envasado);   
      if(envasado.maquina == ''){
        this.servicioLink.disparador.emit('upEnv');
      }else{
        this.servicioLink.disparador.emit('insEnvC');
      }
    }else{
      if(envasado.estado_termo_ctl == 'APROBADA'){
        this.servicioAlert.setAlert('El envasado ya fue autorizada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        this.servicioAlert.setAlert('El envasado ya fue rechazada', 'danger');
        this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }
    }
    
  }

  public upTermo( envasado : any , content : any){ 
   if(envasado.estado_termo_op == 'APROBADA' && envasado.estado_termo_ctl == 'PENDIENTE'){
      this.orden_trabajo = envasado;
      this.parametros    = [{key:'idEnv' , value : envasado.id_envasado}];    
      this.servicioget.get('envDet', this.token , this.parametros).subscribe((data:any) => {     
        this.envDet      = data.envDet;
        this.envArchivo  = data.envArcv;  
      });
      this.tipoAction    = 'Guardar';
      this.modal.open(content, { size: 'xl' });
      
    }else{
      if(envasado.estado_termo_op == 'PENDIENTE'){
          this.servicioAlert.setAlert('El envasado se encuentra pendiente', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        if(envasado.estado_termo_ctl == 'PENDIENTE'){
          this.servicioAlert.setAlert('El envasado se encuentra pendiente', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
        }else{

          if(envasado.estado_termo_ctl == 'APROBADA'){
            this.servicioAlert.setAlert('El envasado ya fue aprobado', 'danger');
            this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
          }else{
            this.servicioAlert.setAlert('El envasado ya fue rechazada', 'danger');
            this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
          }
        
        }
      }
   }      
  }

public verTermo(envasado : any , content:any){
    this.orden_trabajo = {};
    this.envDet        = [];
     this.orden_trabajo = envasado;  
    this.parametros = [{key:'idEnv' , value : envasado.id_envasado}];    
    this.servicioget.get('envDet', this.token , this.parametros).subscribe((data:any) => {     
      this.envDet      = data.envDet;
      this.envArchivo  = data.envArcv;  
    });
    this.modal.open(content, {size:'xl'});    
  }

public accionTermo(content:any, tipo : any , envasado : any){
  if(envasado.estado_termo_op == 'APROBADA' && envasado.estado_termo_ctl == 'PENDIENTE'){
        this.termo = {};
        this.url   = '';      

        if(tipo == 'A'){
          this.tipoAction   = 'Autorización';
          this.url          = 'envConf';
        }else{
          this.tipoAction   = 'Rechazo';
          this.url          = 'envRechazo';
        }      

        this.orden_trabajo = {};
        this.orden_trabajo = envasado;
        this.parametros    = [{key:'idEnv' , value : envasado.id_envasado}];    
        
        this.servicioget.get('envDet', this.token , this.parametros).subscribe((data:any) => {     
          this.envDet      = data.envDet;          
        });
         this.modal.open(content, {size:'xl'}); 
    }else{

      if(envasado.estado_termo_op == 'PENDIENTE'){
          this.servicioAlert.setAlert('El envasado se encuentra pendiente', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      }else{
        if(envasado.estado_termo_ctl == 'PENDIENTE'){
          this.servicioAlert.setAlert('El envasado se encuentra pendiente', 'danger');
          this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
        }else{
          if(envasado.estado_termo_ctl == 'APROBADA'){
            this.servicioAlert.setAlert('El envasado ya fue aprobado', 'danger');
            this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
          }else{
            this.servicioAlert.setAlert('El envasado ya fue rechazada', 'danger');
            this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
          }
        }
      }
    }
  }

  public action(){
    let par : any = [{'idEnv': this.orden_trabajo.id_envasado}];
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

  public upCalidad(obs: any){
    let par : any = [{'idEnv': this.orden_trabajo.id_envasado , 'envObs' : obs}];
    this.val      = true;
    this.loading  = true;
    this.url      = 'upEnvC';

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

public insArchivos(){
    let archivos = {'nombre': this.nombreArch , 'base64': this.arhivosTer , 'idEnv': this.orden_trabajo.id_envasado}; 
    this.servicioget.post('uploadArEnv', this.token, archivos).subscribe(resp => { 
      
      console.log(resp);
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> { 
              this.envArchivo.push(elementx.envArc);  
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
    this.nombreArch  ='';
 
}

capturarFile(event : any){
  const archivoCapturado = event.target.files[0];
  this.nombreArch        = event.target.files[0].name;
  try {
     
      this.myReader.readAsDataURL(archivoCapturado);
      this.myReader.onloadend = (event) => {
        this.arhivosTer  =event.target?.result;
    }
    }
    catch(e: any){
      console.log(e);
    }
}

delArch(index:any , archivo : any , idEnv: any){
  this.envArchivo.splice(index , 1);
  console.log(archivo);    
  let parm = [{'idEnv' : idEnv , 'archivo': archivo}];
  this.servicioget.post('delEnvArcv', this.token, parm).subscribe(resp => {
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
  
downloadDoc(nombre:any){  
  this.parametros = [{key:'archivo' , value : nombre },{ key: 'tipo' , value : 'envasado'}];
  this.servicioget.get('archivos', this.token , this.parametros).subscribe((data:any) => {     
    console.log(data);    
    window.open(data.url,'_blank');
  });
}
}
