import { LoadingService } from './../../../servicios/loading.service';
import { ExcelService } from './../../../servicios/excel.service';
import { AlertasService } from './../../../servicios/alertas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from './../../../servicios/rest.service';
import { UsersService } from './../../../servicios/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Moneda } from './../../../model/moneda.model';
import { DataTableDirective } from 'angular-datatables';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Motivo } from 'src/app/model/motivo.model';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { LogSys } from 'src/app/model/logSys.model';
import { faFileExcel , faAddressCard, faPenToSquare, faTrash , faPlusCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trab-mov-rechazo',
  templateUrl: './trab-mov-rechazo.component.html',
  styleUrls: ['./trab-mov-rechazo.component.css']
})
export class TrabMovRechazoComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblMotivo    : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  validCod     : boolean              = false;
  dato         : number               = 0;
  motivo       : Motivo;
  insMot       : FormGroup;
  upMot        : FormGroup;
  val          : boolean              = false;
  etapa        : string               = '';
  etapas       : any                  = {};
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;

  constructor(private fb          : FormBuilder,
              private servicio    : UsersService,
              private rest        : RestService,
              private modal       : NgbModal,
              private servicioaler: AlertasService,
              private excel       : ExcelService,
              private serviLoad   : LoadingService,
              private serLog      : LogSysService) {

      this.token    = this.servicio.getToken();
      this.motivo   = new Motivo(0,'',0);

      this.insMot = fb.group({
        idEta : ['' , Validators.compose([
          Validators.required,
         ])],
        motDes : ['' , Validators.compose([
          Validators.required,
         ])]
      });

      this.upMot = fb.group({
        motDes : ['' , Validators.compose([
          Validators.required,
         ])],
      });
    }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
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

    let etapas      = [3,4,5,6,7,8];   
    this.parametros = [{"key": "etapas" , "value" :etapas}];      
    this.rest.get('etapasProd' , this.token, this.parametros).subscribe(data => {
      this.etapas   = data;
    });

    this.tblData();
  }

  public tblData(){
    this.tblMotivo = {};
    this.serviLoad.sumar.emit(1);
    this.rest.get('trabMotivo' , this.token, this.parametros).subscribe(data => {
        this.tblMotivo = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );
   }

  public modalIns(content : any ){
    this.modal.open(content);
  }

 public modelUp(content :any , motivo: any ){
  this.motivo.setId(motivo.idMot);
  this.etapa = motivo.etaDes;
  this.upMot.controls['motDes'].setValue(motivo.motDes);
  this.modal.open(content);
}

public del( motivo : any) : boolean{
  let url      = 'delMotivo';
  this.carga   = 'invisible';
  this.loading = true;
  this.serviLoad.sumar.emit(1);
   this.rest.post(url ,this.token, motivo).subscribe(resp => {
       resp.forEach((elementx : any)  => {
         if(elementx.error == '0'){
          let des        = 'Grupo eliminado ' + motivo.motDes ;
          let log        = new LogSys(2, '' , 44 , 'ELIMINAR MOTIVO' , des);
          this.serLog.insLog(log);
          this.serviLoad.sumar.emit(1);
           this.modal.dismissAll();
           setTimeout(()=>{
             this.tblMotivo = {};
             this.rest.get('trabMotivo' , this.token, this.parametros).subscribe(data => {
                 this.tblMotivo = data;
             });

             this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
               dtInstance.destroy().draw();
             });

             this.carga    = 'visible';
             this.loading  = false;
           },1500);

         }else{
           this.carga    = 'visible';
           this.loading  = false;
         }
       });
   });
   this.servicioaler.disparador.emit(this.servicioaler.getAlert());
   return false;
}

public action(motDes : any  , idEta : any , tipo :string ) : boolean{
  let url      = '';
  this.carga   = 'invisible';
  this.loading = true;
  this.val     = true;
  let motivo   = new Motivo(this.motivo.idMot, motDes,idEta );
  let des      = '';
  let lgName   = '';
  let idEtaDes = 0;

  if(tipo =='up'){
     url      = 'updMotivo';
     des      = 'Actualizar motivo ' + motDes;
     lgName   = 'ACTUALIZAR MOTIVO';
     idEtaDes = 43;
  }else{
    url      = 'insMotivo';
    des      = 'Ingreso de motivo ' + motDes;
    lgName   = 'INGRESO MOTIVO';
    idEtaDes = 42;
  }
  this.serviLoad.sumar.emit(1);
 this.rest.post(url, this.token, motivo).subscribe(resp => {
      resp.forEach((elementx : any)  => {
      if(elementx.error == '0'){
        let log        = new LogSys(2, '' , idEtaDes , lgName , des);
        this.serLog.insLog(log);        
        this.serviLoad.sumar.emit(1);
          this.modal.dismissAll();
          setTimeout(()=>{
            this.tblMotivo = {};
            this.rest.get('trabMotivo' , this.token, this.parametros).subscribe(data => {
                this.tblMotivo = data;
            });
            this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
              dtInstance.destroy().draw();
            });

            this.carga    = 'visible';
            this.loading  = false;
            this.val      = false;
            this.limpiar();
          },1500);

      }else {
        this.carga    = 'visible';
        this.loading  = false;
        this.val      = false;
      }
    });
  });
  this.servicioaler.disparador.emit(this.servicioaler.getAlert());
  return false;
}


public Excel(){
  this.excel.exportAsExcelFile(this.tblMotivo, 'motivo');
   return false;
}


 public limpiar(){
  this.insMot.controls['motDes'].setValue('');

 }
}
