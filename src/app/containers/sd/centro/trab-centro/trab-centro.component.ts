import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faAddressCard, faFileExcel, faPenToSquare, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-trab-centro',
  templateUrl: './trab-centro.component.html',
  styleUrls: ['./trab-centro.component.scss']
})
export class TrabCentroComponent {

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
  accion      : string                =  '';
  centro      : any                   =  {};
  cenDir      : string                = '';
  places      : any                   = {};


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
    this.rest.get('trabCentro' , this.token, this.parametros).subscribe(data => {
        this.tblObj = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblObj, 'centro');
     return false;
  }

  public ins(content: any, accion:any){ 
    this.modal.open(content);
  
    this.accion = accion;
  }

  
  public up(content: any, accion:any , centro : any){
    this.modal.open(content);
    this.accion = accion;
    this.centro = centro;
  }
  
  public almacen(centro : any){    
    const objstring = JSON.stringify(centro);    
   this.router.navigate(['home/sd/centro/almacen/'  + objstring]);
  }

  guardar(cenDes:any , tipo :string ){
    let url      = '';
    this.carga   = 'invisible';
    this.loading = true;   

    if(tipo =='up'){
      url      = 'updCentro';
    }else{
      url      = 'insCentro';
    }
    let data = {cenDes:cenDes ,cenPlace: this.places , cenDir: this.cenDir , centroId:this.centro.centroId};    
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

  place(event:any){
    this.cenDir = event.cenDir;
    this.places  = event.place; 
  }

  

  


}