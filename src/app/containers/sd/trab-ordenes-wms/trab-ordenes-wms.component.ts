import { Component, ViewChild } from '@angular/core';
import { faAddressCard, faBuildingCircleArrowRight, faClipboardList, faEye, faFileExcel, faPenToSquare, faSquarePlus, faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ExcelService } from 'src/app/servicios/excel.service';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trab-ordenes-wms',
  templateUrl: './trab-ordenes-wms.component.html',
  styleUrls: ['./trab-ordenes-wms.component.scss']
})
export class TrabOrdenesWmsComponent {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;

  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblObj       : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faSquarePlus                        = faSquarePlus;
  faTrash                             = faTrash;
  accion      : string                = '';
  tipo        : any                   = {};
  cenDir      : string                = '';
  places      : any                   = {};
  dt          :any                    = {};
  faBuildingCircleArrowRight          = faBuildingCircleArrowRight;
  faEye                               = faEye;
  prd         :any                    = {};
  faSyncAlt                           = faSyncAlt;
  colums     :string []               = [];
  isQuantityValid: boolean            = false;
  faClipboardList                     = faClipboardList;
  sectorFil : any                     = {};
  val       : boolean                = false;
  disable   : boolean                = false;
  

  constructor(
              private servicio     : UsersService,
              private rest         : RestService,
              private excel        : ExcelService,             
              private serviLoad    : LoadingService,
              private router       : Router,
              private modal        : NgbModal
             
    ) {
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
  }

  public tblData(){
    this.serviLoad.sumar.emit(1);
    this.tblObj = {};
    this.rest.get('trabSdOrden' , this.token, this.parametros).subscribe((data : any) => {
        this.tblObj = data.data;
        this.colums = data.colums;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblObj, 'ordenes_wms');
     return false;
  }

  public ver(data:any , content:any){
    this.dt = data;    
    this.parametros = [{key:'ordId' , value:this.dt.ordId}];
    this.rest.get('verSdOrden' , this.token, this.parametros).subscribe((data:any) => {
        this.prd = data;
    });
    this.modal.open(content);
  }
  public verificarEE(data:any , content : any ){
  /*  this.parametros =[ {'id': data.opedId} , {'tipPed': 'WEB'}];
    this.rest.post('insSdOrden' , this.token, this.parametros).subscribe(data => {
        
    });*/
    this.dt = data;    
    this.parametros = [{key:'centroId' , value:this.dt.centroId} , {key:'almId' , value:this.dt.almId}];
    this.rest.get('sectorFil' , this.token, this.parametros).subscribe((data:any) => {
        this.sectorFil = data;
    });

    this.parametros = [{key:'ordId' , value:this.dt.ordId}];
    this.rest.get('verSdOrden' , this.token, this.parametros).subscribe((data:any) => {
        this.prd = data;
    });

    this.modal.open(content , { size: 'xl' });
    console.log(data);
  }

  validateQuantities() {
    // Comprueba si al menos un producto tiene cantidad mayor a 0
     this.isQuantityValid = this.prd.some((item: any) => item.enteredQty && item.enteredQty > 0);
  }


  refrescar(){
    this.parametros =[];
    this.tblData();
  }
  public addFilter(parametros: any){
    this.parametros = parametros;
    this.tblData();
  }
  
  generarIBLPN(orden:any , prd:any){
    console.log(orden);
    console.log(prd);
    this.disable = true;
    this.disable = false;
    
  } 
}