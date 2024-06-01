import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAddressCard, faArrowTurnDown, faFileExcel, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertasService } from 'src/app/servicios/alertas.service';


@Component({
  selector: 'app-trab-acciones',
  templateUrl: './trab-acciones.component.html',
  styleUrls: ['./trab-acciones.component.scss']
})
export class TrabAccionesComponent {
  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblobj       : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faTrash                             = faTrash;
  opcion      : any                   = {};
  faArrowTurnDown                     = faArrowTurnDown;
  ins        : FormGroup;
  accType    : string                 = '';
  
  types: string[]                    = ["success", "danger", "warning"];
  constructor(
              private servicio     : UsersService,
              private rest         : RestService,
              private excel        : ExcelService,             
              private serviLoad    : LoadingService,
              private router       : Router,
              private route        : ActivatedRoute,
              private modal        : NgbModal,
              fgIns                : FormBuilder
         
    ) {
            this.token = this.servicio.getToken();
            this.ins = fgIns.group({
              accUrl : ['' , Validators.compose([
                Validators.required,
               ])],
               accDes : ['' , Validators.compose([
                Validators.required,
               ])]
               
              });



    }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const obj = params['opcion'];      
      this.opcion = obj;
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
    this.tblobj = {};

    this.parametros = [{key: 'optId' , value: this.opcion}]
    this.rest.get('trabAcciones' , this.token, this.parametros).subscribe(data => {
        this.tblobj = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblobj, 'acciones');
     return false;
  }

  public del(accion:any){
    let url      = 'delAcciones';
    this.carga   = 'invisible';
    this.loading = true;   
    let  acciones= {optId:this.opcion, accId:accion.accId}
    this.serviLoad.sumar.emit(1);
    this.rest.post(url, this.token, acciones).subscribe(resp => {
      this.modal.dismissAll(); 
      this.loading = false; 
      this.tblData();
     });
   
    return false;
  }

  public modalO(modalIns:any){
    this.modal.open(modalIns);
  }
  
  public guardar(accUrl:any , accDes:any , accMessage: any){
    let url      = 'insAcciones';
    this.carga   = 'invisible';
    this.loading = true;
    let  acciones= {optId:this.opcion, accUrl:accUrl,accDes:accDes, accType:this.accType , accMessage:accMessage }
    this.serviLoad.sumar.emit(1);
    this.rest.post(url, this.token, acciones).subscribe(resp => {
      this.modal.dismissAll(); 
      this.loading = false; 
      this.tblData();
    });
   
    return false;
  } 

}
