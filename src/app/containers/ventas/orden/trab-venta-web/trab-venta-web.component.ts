import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faAddressCard, faBuildingCircleArrowRight, faEye, faFileExcel, faPenToSquare, faSquarePlus, faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-trab-venta-web',
  templateUrl: './trab-venta-web.component.html',
  styleUrls: ['./trab-venta-web.component.scss']
})
export class TrabVentaWebComponent {


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
    this.rest.get('trabVentaWeb' , this.token, this.parametros).subscribe((data : any) => {
        this.tblObj = data.data;
        this.colums = data.colums;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblObj, 'ordenes_web');
     return false;
  }

  public ver(data:any , content:any){
    this.dt = data;
    this.parametros = [{key:'opedId' , value:this.dt.opedId}];
    this.rest.get('venta_det' , this.token, this.parametros).subscribe((data:any) => {
        this.prd = data;
    });
    this.modal.open(content);
  }
  public generaSalida(data:any){
  /*  this.parametros =[ {'id': data.opedId} , {'tipPed': 'WEB'}];
    this.rest.post('insSdOrden' , this.token, this.parametros).subscribe(data => {
        
    });*/
    console.log(data);
  }

  refrescar(){
    this.parametros =[];
    this.tblData();
  }
  public addFilter(parametros: any){
    this.parametros = parametros;
    this.tblData();
  }
  

}