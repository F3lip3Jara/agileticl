import { LoadingService } from '../../../../servicios/loading.service';
import { RestService } from '../../../../servicios/rest.service';
import { UsersService } from '../../../../servicios/users.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelService } from 'src/app/servicios/excel.service';
import { DataTableDirective } from 'angular-datatables';
import { faAddressCard, faFileExcel, faPenToSquare, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-trab-empresa',
  templateUrl: './trab-empresa.component.html',
  styleUrls: ['./trab-empresa.component.css']
})
export class TrabEmpresaComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;
  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblEmpresa   : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faSquarePlus                        = faSquarePlus;
  constructor(
              private servicio     : UsersService,
              private rest         : RestService,
              private excel        : ExcelService,             
              private serviLoad    : LoadingService,
              private router       : Router
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
    this.tblEmpresa = {};
    this.rest.get('trabEmpresa' , this.token, this.parametros).subscribe(data => {
        this.tblEmpresa = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblEmpresa, 'empresa');
     return false;
  }

  public ins(){
    this.router.navigate(['home/seguridad/administracion/empresa/ins']);
  }

  public opciones(empresa : any){   
    const empresaString = JSON.stringify(empresa);    
    this.router.navigate(['home/seguridad/administracion/empresa/opciones/' + empresaString]);
  }

  public actualizar(empresa:any){
    const empresaString = JSON.stringify(empresa);  
    console.log(empresa);
    this.router.navigate(['home/seguridad/administracion/empresa/up/' + empresaString]);
  }

}
