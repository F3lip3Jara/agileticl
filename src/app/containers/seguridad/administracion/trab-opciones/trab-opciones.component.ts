import { LoadingService } from '../../../../servicios/loading.service';
import { RestService } from '../../../../servicios/rest.service';
import { UsersService } from '../../../../servicios/users.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelService } from 'src/app/servicios/excel.service';
import { DataTableDirective } from 'angular-datatables';
import { faAddressCard, faFileExcel, faPenToSquare, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertasService } from 'src/app/servicios/alertas.service';

@Component({
  selector: 'app-trab-opciones',
  templateUrl: './trab-opciones.component.html',
  styleUrls: ['./trab-opciones.component.scss']
})
export class TrabOpcionesComponent {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblOpciones   : any                 = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faSquarePlus                        = faSquarePlus;
  faTrash                             = faTrash;
  accion      : string                =  '';
  opcion      : any                   =  {};

  constructor(
              private servicio     : UsersService,
              private rest         : RestService,
              private excel        : ExcelService,             
              private serviLoad    : LoadingService,
              private router       : Router,
              private modal        : NgbModal,
              private servicioaler  : AlertasService
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
    this.tblOpciones = {};
    this.rest.get('trabOpciones' , this.token, this.parametros).subscribe(data => {
        this.tblOpciones = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblOpciones, 'opciones');
     return false;
  }

  public ins(content: any, accion:any){
    this.modal.open(content);
    this.accion = accion;
  }

  
  public up(content: any, accion:any , opcion : any){
    this.modal.open(content);
    this.accion = accion;
    this.opcion = opcion;
  }

  

  public acciones(opcion : any){    
   this.router.navigate(['home/seguridad/administracion/opciones/acciones/'  + opcion.optId]);
  }

  guardar(optLink:any , optDes:any ,  tipo :string ){
    let url      = '';
    this.carga   = 'invisible';
    this.loading = true;   

    if(tipo =='up'){
      url      = 'updOpciones';
    }else{
      url      = 'insOpciones';
    }
    let opcion = {optId:this.opcion.optId ,optDes: optDes , optLink:optLink};    
    this.serviLoad.sumar.emit(1);
    this.rest.post(url, this.token, opcion ).subscribe(resp => {
      this.modal.dismissAll(); 
      this.loading = false; 
      this.tblData();
    });
    this.servicioaler.disparador.emit(this.servicioaler.getAlert());
    return false;
  }

  del(opcion: any){
    let url = 'delOpciones';
    this.serviLoad.sumar.emit(1);
    this.rest.post(url, this.token, opcion ).subscribe(resp => {
      this.modal.dismissAll(); 
      this.loading = false; 
      this.tblData();
    });
    this.servicioaler.disparador.emit(this.servicioaler.getAlert());
    return false;
  }
}
