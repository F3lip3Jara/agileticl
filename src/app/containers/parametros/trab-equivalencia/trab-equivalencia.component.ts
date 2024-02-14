import { Component,  OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LogSys } from 'src/app/model/logSys.model';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { CalJulService } from 'src/app/servicios/cal-jul.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LinksService } from 'src/app/servicios/links.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { faSyncAlt,faFileExcel , faAddressCard, faPenToSquare, faTrash , faPlusCircle} from '@fortawesome/free-solid-svg-icons';

import * as XLSX from 'xlsx';




@Component({
  selector: 'app-trab-equivalencia',
  templateUrl: './trab-equivalencia.component.html',
  styleUrls: ['./trab-equivalencia.component.css']
})
export class TrabEquivalenciaComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;

  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  dtOptions    : DataTables.Settings  = {} ;
  loading      : boolean              = true; 
  producto     : any                  = {};
  filtro       : FormGroup;
  insCal       : FormGroup;
  converJson   : any []               = [] ;
  token        : string               = '';
  parametros   : any []               = [];
  statesx      : any                  ;
  states       : string[]             = [];
  carga        : string              = "invisible";
  model        : any;
  val          : boolean              = false;
  anox         : any;
  nombreArch   : string               = 'Seleccione archivo';
  equiError    :any;
  equiOk       :any;
  equiAct      :any;
  totalEr      :number                = 0;
  totalOk      :number                = 0;
  totalAct     :number                = 0;
  tblPrdEqui   :any;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;
  faSyncAlt                           = faSyncAlt;
  
  constructor(private servicio     : UsersService ,
              private servicioget  : RestService,
              private fb           : FormBuilder,
              private excel        : ExcelService,
              private modal        : NgbModal,
              private servicioLink : LinksService,
              private servicioAlert: AlertasService,            
              private config       : NgbModalConfig,
              private serviLoad    : LoadingService,
              private servicioCal   : CalJulService,
              private serLog       : LogSysService) {

      config.backdrop = 'static';
      config.keyboard = false;
      this.tblPrdEqui = {};

      this.filtro = fb.group({
              flCalAno : ['']
      });

      this.insCal = fb.group({
         calAno : ['',  Validators.compose([
          Validators.required])]
      });

      this.token = this.servicio.getToken();
    }

 ngOnInit(): void {
  this.tblData();
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
      this.serviLoad.sumar.emit(1);
  }

  public tblData(){  
    this.serviLoad.sumar.emit(1);
    this.tblPrdEqui = {};
    this.servicioget.get('trabPrdEqui' , this.token, this.parametros).subscribe(data => {
        this.tblPrdEqui = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );
  }

  public refrescar(){
    this.loading       = true;
    this.carga         = 'invisible';   
    this.tblData();
    this.serviLoad.sumar.emit(1);
   }
    public Excel(){
      this.excel.exportAsExcelFile(this.tblPrdEqui, 'equivalencia');
      return false;
    }
    nuevo( content : any){
      this.modal.open(content);
    }

    capturarFile(event : any ){
      this.nombreArch  = event.target.value;
      this.nombreArch  = this.nombreArch.substring(12,33);     
      const selectFile = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(selectFile);
      fileReader.onload = (eventx)=>{
        let binaryData  = eventx.target?.result;
        let workBook    = XLSX.read(binaryData , {type:'binary'});
        workBook.SheetNames.forEach(sheet => {
          const data = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
          this.converJson = data;
        });
      }
    }

    public cargarArcv( json : any ,  content: any){
      this.val        = true;    
      let parm        = {'detalle' : json};  
      this.totalEr    = 0;
      this.totalOk    = 0;
      this.totalAct   = 0;   
      this.servicioget.post('valEqui', this.token, parm).subscribe((resp:any) => {
        resp.forEach((elementx : any)  => {
            this.val      = false;                                       
            this.totalEr  = elementx.totalEr;
            this.totalOk  = elementx.totalOk;
            this.totalAct = elementx.totalAct;   
            this.equiError= elementx.prd_er;
            this.equiOk   = elementx.prd_ok;
            this.equiAct  = elementx.prd_ac;  
            this.modal.open(content);
        });
       });
    }

    public descargarExcel(excel:any , tipo:any){
      this.excel.exportAsExcelFile(excel, tipo);
      return false;
    }

    public guardar(){
      this.nombreArch = '';
      let parm        = {'equiOk' : this.equiOk , 'equiAct': this.equiAct};
      this.val        = true;
      this.servicioget.post('insEquival', this.token, parm).subscribe((resp:any) => {
        resp.forEach((elementx : any)  => {
          if(elementx.error == '0'){
            this.serviLoad.sumar.emit(1);
              this.modal.dismissAll();
              setTimeout(()=>{              

                this.tblData();
                this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
                  dtInstance.destroy().draw();
                });                
                let log        = new LogSys(2, '' , 45 , 'CARGAR EQUIVALENCIA' , 'CARGAR EQUIVALENCIA');
                this.serLog.insLog(log);   
                this.carga    = 'visible';
                this.loading  = false;
                this.val      = false;
              //  this.limpiar();
              },1500);
    
          }else {
            this.carga    = 'visible';
            this.loading  = false;
            this.val      = false;
          }
        });
    });
  }

}