import { LoadingService } from './../../../servicios/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { Gerencia } from 'src/app/model/gerencia.model';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from 'src/app/servicios/excel.service';

import {  faPenToSquare,faTrash,faFileExcel,faAddressCard} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trab-gerencia',
  templateUrl: './trab-gerencia.component.html',
  styleUrls: ['./trab-gerencia.component.css']
})
export class TrabGerenciaComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblGerencia  : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  gerencia     : Gerencia;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;

  
  constructor(
              private servicio    : UsersService,
              private rest        : RestService,
              private modal       : NgbModal,
              private excel       : ExcelService,
              private serviLoad   : LoadingService,
             ) {

      this.token    = this.servicio.getToken();
      this.gerencia = new Gerencia(0, '');
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

      this.tblData();
  }

  public tblData(){
    this.serviLoad.sumar.emit(1);
    this.tblGerencia = {};
    this.rest.get('trabGerencia' , this.token, this.parametros).subscribe(data => {
        this.tblGerencia = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );
   }

   public modalIns(content : any ){
    this.modal.open(content);
 }

 public modelUp(content :any , xgerencia: Gerencia ){
  this.gerencia.setId(xgerencia.gerId);
  this.gerencia.setGerDes(xgerencia.gerDes);
  this.modal.open(content);
}

public delGerencia( gerencia : any) : boolean{
  let url      = 'delGerencia';
  this.carga   = 'invisible';
  this.loading = true;
  this.serviLoad.sumar.emit(1);
   this.rest.post(url ,this.token, gerencia).subscribe(resp => {
    this.tblData();
  });
   return false;
}

public action(gerDesx : any , tipo :string ) : boolean{
  let url       = '';
  this.carga    = 'invisible';
  this.loading  = true;
  let gerenciax = new Gerencia(this.gerencia.gerId , gerDesx  );
  if(tipo =='up'){
     url      = 'updGerencia';
   }else{
    url      = 'insGerencia';
   }

 this.serviLoad.sumar.emit(1);
 this.rest.post(url, this.token, gerenciax).subscribe(resp => {   
     this.modal.dismissAll();
     this.tblData();
  });
  return false;
}


public Excel(){
  this.excel.exportAsExcelFile(this.tblGerencia, 'gerencia');
   return false;
}

}
