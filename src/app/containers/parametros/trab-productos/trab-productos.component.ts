import { LoadingService } from './../../../servicios/loading.service';
import { ProductosServiceService } from './../../../servicios/productos-service.service';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component,  OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { faFileExcel , faAddressCard, faPenToSquare, faTrash , faPlusCircle , faSearch, faSyncAlt, faFilter, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-trab-productos',
  templateUrl: './trab-productos.component.html',
  styleUrls: ['./trab-productos.component.css']
})
export class TrabProductosComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective; 
  dtOptions    : DataTables.Settings  = {} ;
  loading      : boolean              = true;
  tblProductos : any                  = {};
  producto     : any                  = {};  
  token        : string               = '';
  parametros   : any []               = [];
  statesx      : any                  ;
  states       : string[]             = [];
  upPrd        : FormGroup             ;
  carga        : string               = "invisible";
  model        : any;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;
  faSyncAlt                           = faSyncAlt;
  faSearch                            = faSearch;
  faFilter                            = faFilter;
  faTrashCan                          = faTrashCan;
  colums: string[]                    = [];


  constructor(private servicio     : UsersService ,
              private servicioget  : RestService,
              private modal        : NgbModal,
              private fb           : FormBuilder,
              private excel        : ExcelService,
              private servicePrd   : ProductosServiceService,
              private serviLoad    : LoadingService,
              private router       : Router

    ) {
      this.token = this.servicio.getToken();
      this.upPrd = fb.group({
        upPrdDes : ['', Validators.compose([
         Validators.required
        ])]
      });
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


ngAfterViewInit(): void {
}

public tblData(){
    this.tblProductos       = {};
    this.serviLoad.sumar.emit(1);
    this.servicioget.get('trabProducto' , this.token, this.parametros).subscribe((respuesta:any) => {
      this.tblProductos = respuesta.data;
       this.colums = respuesta.colums; // Columnas originales   
     });
     setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
  }

  public refrescar(){
    this.parametros = [];
    this.tblData();
  }

  public Excel(){
      this.excel.exportAsExcelFile(this.tblProductos, 'producto');
    return false;
  }

  public prvNuevo(){
    this.router.navigate(['home/parametros/productos/ingreso']);
 }

 public modelUp(xproductos : any){
  const objstring = JSON.stringify(xproductos.id);    
  this.router.navigate(['home/parametros/productos/actualizar/'  + objstring]);
 }

 public addFilter(parametros: any){
    this.parametros = parametros;
    this.tblData();
 }


}
