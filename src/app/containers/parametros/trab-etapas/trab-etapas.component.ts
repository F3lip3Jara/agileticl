import { LoadingService } from '../../../servicios/loading.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Etapas } from 'src/app/model/etapas.model';
import { ExcelService } from 'src/app/servicios/excel.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { faFileExcel , faAddressCard, faPenToSquare, faTrash , faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-trab-etapas',
  templateUrl: './trab-etapas.component.html',
  styleUrls: ['./trab-etapas.component.css']
})
export class TrabEtapasComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;

  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblEtapas    : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  etapas       : Etapas;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;
  etaProdx                            = '';
  constructor(
              private servicio     : UsersService,
              private rest         : RestService,
              private modal        : NgbModal,
              private excel        : ExcelService,         
              private serviLoad    : LoadingService,
              private router       : Router) {

      this.token = servicio.getToken();
      this.etapas= new Etapas(0, '' , '');
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
    this.tblEtapas = {};
    this.rest.get('trabEtapas' , this.token, this.parametros).subscribe(data => {
        this.tblEtapas = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public modalIns(content : any ){
      this.modal.open(content);
  }

  public modelUp(content :any , etapasx: Etapas){
    this.etapas.setetaId(etapasx.etaId);
    this.etapas.setEtaDes(etapasx.etaDes);
    this.etapas.setEtProd(etapasx.etaProd);
    this.etaProdx = this.etapas.etaProd;
    this.modal.open(content);
  }

  public Excel(){
  this.excel.exportAsExcelFile(this.tblEtapas, 'roles');
  return false;
  }

  public delEtapas(etapas : any){
    let url      = 'delEtapas';
    this.carga   = 'invisible';
    this.loading = true;
    this.serviLoad.sumar.emit(1);
     this.rest.post(url ,this.token, etapas).subscribe(resp => {  
      this.tblData();
     });
     return false;
  }

  public actionEtapa(etapas : any , etaProd: any, tipo :string ){
    let url      = '';
    let etapasx  = new Etapas(this.etapas.etaId , etapas , etaProd );
    this.carga   = 'invisible';
    this.loading = true;

    if(tipo =='up'){
       url = 'updEtapas';
    }else{
      url = 'insEtapas';
    }
    this.serviLoad.sumar.emit(2);
    this.rest.post(url, this.token, etapasx).subscribe((resp:any) => {
      this.modal.dismissAll(); 
      this.loading = false;          
      this.tblData();
    
    });
  
    return false;
  }


}
