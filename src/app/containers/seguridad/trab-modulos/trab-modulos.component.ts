import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Roles } from 'src/app/model/rol.model';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { faFileExcel , faAddressCard, faPenToSquare, faTrash} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trab-modulos',
  templateUrl: './trab-modulos.component.html',
  styleUrls: ['./trab-modulos.component.css']
})
export class TrabModulosComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblModulo    : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  roles        : Roles;
  carga        : string               = "invisible";
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faTrash                             = faTrash;

  constructor(private fb            : UntypedFormBuilder,
              private servicio      : UsersService,
              private rest          : RestService,
              private modal         : NgbModal,
              private excel         : ExcelService,
              private servicioaler  : AlertasService,
              private serviLoad     : LoadingService,
              private router        : Router
    ) {
      this.token = this.servicio.getToken();
      this.roles = new Roles(0, '');
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
    this.tblModulo = {};
    this.rest.get('trabModule' , this.token, this.parametros).subscribe(data => {
        this.tblModulo = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

   public nuevo(){
    this.router.navigate(['home/seguridad/modulos/insModulo/']);
  } 

 
  public Excel(){
    this.excel.exportAsExcelFile(this.tblModulo, 'modulos');
     return false;
  }

  public up(modulo:any){
    const objstring = JSON.stringify(modulo);
    this.router.navigate(['home/seguridad/modulos/upModulo/' + objstring]);
  }

  public del(modulo:any){
    let url      = 'delModulo';
    this.carga   = 'invisible';
    this.loading = true;
    this.serviLoad.sumar.emit(1);
     this.rest.post(url ,this.token, modulo).subscribe(resp => {
         this.tblData();
         this.loading = false;
         this.servicioaler.disparador.emit(this.servicioaler.getAlert());
     });
    
  }
}
