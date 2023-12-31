import { LoadingService } from './../../../servicios/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from './../../../servicios/rest.service';
import { UsersService } from './../../../servicios/users.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelService } from 'src/app/servicios/excel.service';
import { DataTableDirective } from 'angular-datatables';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-trab-notificaciones',
  templateUrl: './trab-notificaciones.component.html',
  styleUrls: ['./trab-notificaciones.component.css']
})
export class TrabNotificacionesComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblNotifi    : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  faFileExcel                         = faFileExcel;

  constructor(
              private servicio     : UsersService,
              private rest         : RestService,
              private excel        : ExcelService,
              private serviLoad    : LoadingService
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
    this.tblNotifi = {};
    this.rest.get('trabNot' , this.token, this.parametros).subscribe(data => {
        this.tblNotifi = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public Excel(){
     this.excel.exportAsExcelFile(this.tblNotifi, 'Notificaciones');
     return false;
  }

}
