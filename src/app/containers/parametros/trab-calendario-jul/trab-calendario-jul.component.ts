import { LoadingService } from './../../../servicios/loading.service';
import { CalJulService } from './../../../servicios/cal-jul.service';
import * as XLSX from 'xlsx';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { LinksService } from 'src/app/servicios/links.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { Subject, OperatorFunction } from 'rxjs';
import { NgbTypeahead, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { LogSys } from 'src/app/model/logSys.model';
import { faFileExcel , faAddressCard, faPenToSquare, faTrash , faPlusCircle , faSearch, faSyncAlt} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-trab-calendario-jul',
  templateUrl: './trab-calendario-jul.component.html',
  styleUrls: ['./trab-calendario-jul.component.css']
})

export class TrabCalendarioJulComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;
  @ViewChild("calAno")  calAno? : ElementRef;

  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  dtOptions    : DataTables.Settings  = {} ;
  loading      : boolean              = true;
  tblCal       : any                  = {};
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
  ano                                 = ["Seleccione","2022","2023","2024", "2025" , "2026" , "2027" , "2028","2029", "2030"];
  anox         : any;
  nombreArch   : string               = 'Seleccione archivo';
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;
  faSyncAlt                           = faSyncAlt;
  faSearch                            = faSearch;

  constructor(private servicio     : UsersService ,
              private servicioget  : RestService,
              private fb           : FormBuilder,
              private excel        : ExcelService,
              private modal        : NgbModal,
              private servicioLink : LinksService,
           //   private servicioAlert: AlertasService,            
              private config       : NgbModalConfig,
              private serviLoad    : LoadingService,
              private servicioCal   : CalJulService,
              private serLog       : LogSysService) {

      config.backdrop = 'static';
      config.keyboard = false;

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
      this.serviLoad.sumar.emit(1);
  }

  public buscar(calAno : string ){
    if (calAno){
      this.loading      = true;
      let parm : any[]  = [{key :'ano' ,value: calAno} ];
      this.tblCal = {};
      this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
          dtInstance.destroy().draw();
        });
      this.servicioget.get('trabCalJul' , this.token, parm).subscribe(respuesta => {
          this.tblCal       = respuesta;
          this.loading      = false;
         });
      this.serviLoad.sumar.emit(1);
    }else{
      /*this.servicioAlert.setAlert('Debe ingresar un filtro', 'warning');
      this.servicioAlert.disparador.emit();*/
     
    }
  }


  public tblData(){
   this.tblCal = {};
   this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
    dtInstance.destroy().draw();
  });
  
   this.servicioget.get('busUltAno', this.token , this.parametros).subscribe((rest:any) =>{
    rest.forEach((element: any) => {
          this.anox = element.calAno;    
  });
    this.parametros = [{key : 'ano' , value : this.anox}];
       this.servicioget.get('trabCalJul' , this.token, this.parametros).subscribe(respuesta => {
          this.tblCal = respuesta;
          setTimeout(()=> {
            this.carga = 'visible';
            this.loading = false;
        },2000 );
        });   
    });
    
    
  }

  public refrescar(){
    this.loading       = true;
    this.carga         = 'invisible';
    this.tblCal   = {};
    this.tblData();
    this.serviLoad.sumar.emit(1);
   }
    public Excel(){
        this.excel.exportAsExcelFile(this.tblCal, 'calendario_juliano');
        return false;
    }
    nuevo( content : any){
      this.insCal.reset();
      this.modal.open(content);
    }

    capturarFile(event : any){
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

    public cargarCal(calAno : any , json : any){
      this.val        = true;
      let validaForm  = 0;
      json.some((element:any) =>{
        validaForm = element.Dia;
        try {
          return true;
        } catch (error) {
          this.val= false;
          return true;
        }
      });

    if(validaForm > 0){
      let valCal = [{ 'key' : 'ano' ,'value' : calAno}];
      this.servicioget.get('valCal', this.token, valCal).subscribe((data: any) => {
          if(data.length == 0){
            this.serviLoad.sumar.emit(2);
            this.parametros = [{ 'ano' : calAno ,'detalle' : json}];
            this.servicioget.post('insCalJul', this.token, this.parametros).subscribe(resp => {
                resp.forEach((elementx : any)  => {
                  if(elementx.error == '0'){                   
                 //   this.servicioAlert.setAlert('Calendario cargado de manera correcta', 'success');
        
                    this.modal.dismissAll();
                    this.servicioCal.actualAno();
                    this.val        = false;
                    this.anox       = calAno;                   
                    this.tblData();
                    this.nombreArch = '';
                    let des        = 'Carga de calendario juliano' + calAno;
                    let log        = new LogSys(2, '' , 13 , '	CARGAR CALENDARIO JUL' , des);
                    this.serLog.insLog(log);
                  }else{
                    this.carga    = 'visible';
                    this.loading  = false;
                    this.val      = false;
                  }
                });
            });
            if(this.anox != ' '){
               this.refrescar();
            }
          }else{

            var opcion = confirm("Esta seguro de volver a carga el calendario. Ya existe calendario cargado para el año seleccionado");
                if (opcion == true) {
                  this.serviLoad.sumar.emit(2);
                  this.parametros = [{ 'ano' : calAno ,'detalle' : json}];                
                  this.servicioget.post('delCalJul' , this.token , this.parametros).subscribe(resp =>{
                    resp.forEach((elementx : any)  => {
                      if(elementx.error == '0'){
                        let des         = 'Elimnación de calendario juliano' + calAno;
                        let log         = new LogSys(2, '' , 13 , '	CARGAR CALENDARIO JUL' , des);
                        this.serLog.insLog(log);                  
                        
                        this.servicioget.post('insCalJul', this.token, this.parametros).subscribe(resp => {
                          resp.forEach((elementx : any)  => {
                            if(elementx.error == '0'){                    
                              this.modal.dismissAll();
                              this.val        = false;
                              this.insCal.reset();
                              this.nombreArch = '';
                              let des         = 'Carga de calendario juliano' + calAno;
                              let log         = new LogSys(2, '' , 13 , '	CARGAR CALENDARIO JUL' , des);
                              this.serLog.insLog(log);
                            }else{
                              this.carga    = 'visible';
                              this.loading  = false;
                              this.val      = false;                              
                            }
                          });
                         });
                      }else{
                        this.carga    = 'visible';
                        this.loading  = false;
                        this.val      = false;
                      }
                    });
                  });

              } else {
                  this.carga    = 'visible';
                  this.loading  = false;
                  this.val      = false;
              }
          }
         
         // this.servicioAlert.disparador.emit(this.servicioAlert.getAlert());
      });

    }else{
      this.val= false;
    //  this.servicioAlert.setAlert('Debe ingresar Excel con estructura correcta', 'warning');
//this.servicioAlert.disparador.emit();
    }


    }





}
