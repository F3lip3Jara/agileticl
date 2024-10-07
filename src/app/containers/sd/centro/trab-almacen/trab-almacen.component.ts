import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAddressCard, faArrowTurnDown, faFileExcel, faPenToSquare, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-trab-almacen',
  templateUrl: './trab-almacen.component.html',
  styleUrls: ['./trab-almacen.component.scss']
})
export class TrabAlmacenComponent {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;
 

 

  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblObj       : any                 = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faSquarePlus                        = faSquarePlus;
  faTrash                             = faTrash;
  faArrowTurnDown                     =faArrowTurnDown;
  accion      : string                =  '';
  centro      : any                   =  {};
  almacen     : any                   = {};

  constructor(
              private servicio     : UsersService,
              private rest         : RestService,
              private excel        : ExcelService,             
              private serviLoad    : LoadingService,
              private router       : Router,
              private modal        : NgbModal,
              private route        : ActivatedRoute
             
    ) {
            this.token = this.servicio.getToken();
    }
 


  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const obj = params['centro'];
      this.centro = JSON.parse(obj);
    });


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
    this.parametros = [{key: 'centroId' , value: this.centro.centroId}]

    this.rest.get('trabAlmacen' , this.token, this.parametros).subscribe(data => {
        this.tblObj = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblObj, 'almacen');
     return false;
  }

  public ins(content: any, accion:any){ 
    this.modal.open(content);
    this.accion = accion;
  }

  public up(content: any, accion:any , almacen : any){
    this.modal.open(content);
    this.accion = accion;
    this.almacen = almacen;
  }

  guardar(almDes:any , tipo :string ){
    let url      = '';
    this.carga   = 'invisible';
    this.loading = true;   

    if(tipo =='up'){
      url      = 'updAlmacen';
    }else{
      url      = 'insAlmacen';
    }
    let data = {centroId:this.centro.centroId ,almDes: almDes , almId:this.almacen.almId};    
       this.serviLoad.sumar.emit(1);
    this.rest.post(url, this.token, data ).subscribe(resp => {
      this.modal.dismissAll(); 
      this.loading = false; 
      this.tblData();
    });
   
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
 
    return false;
  }

  


}
