import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faAddressCard, faArrowTurnDown, faArrowUp, faFileExcel, faNetworkWired, faPenToSquare, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-trab-subopciones',
  templateUrl: './trab-subopciones.component.html',
  styleUrls: ['./trab-subopciones.component.scss']
})
export class TrabSubopcionesComponent {
  dtOptions       : DataTables.Settings  = {} ;
  loading         : boolean              = true;
  tblobj          : any                  = {};
  token           : string               = '';
  parametros      : any []               = [];
  carga           : string               = "invisible";
  faFileExcel                            = faFileExcel;
  faAddressCard                          = faAddressCard;
  faPenToSquare                          = faPenToSquare;
  faTrash                                = faTrash;
  modulo          : any                  = {};
  faArrowTurnDown                        = faArrowTurnDown;
  ins             : FormGroup; 
  optAsig         : any                  = [];
  optnAsig        : any                  = [];  
  faStar                                 = faStar;
  faArrowUp                              = faArrowUp;
  val             : boolean              = false;
  faNetworkWired                         = faNetworkWired;

  
  constructor(
              private servicio     : UsersService,
              private rest         : RestService,
              private excel        : ExcelService,             
              private serviLoad    : LoadingService,
              private router       : Router,
              private route        : ActivatedRoute,
              private modal        : NgbModal,
              fgIns                : FormBuilder,
              private servicioaler : AlertasService
         
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
      const obj = params['modulo'];      
      this.modulo = JSON.parse(obj);
    });
    this.parametros = [{key: 'modulo' , value: JSON.stringify(this.modulo) }];
    this.rest.get('snAsigOpt', this.token,this.parametros).subscribe(data => {
      this.optnAsig = data;
    });

   /* this.rest.get('asigOpt', this.token,this.parametros).subscribe(data => {
      this.optAsig = data;
    });*/

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
    this.tblobj     = {};
    this.parametros = [{key: 'modulo' , value: JSON.stringify(this.modulo) }];
    this.rest.get('trabsubopc' , this.token, this.parametros).subscribe(data => {
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
    let  acciones= {optId:this.modulo, accId:accion.accId}
    this.serviLoad.sumar.emit(1);
    this.rest.post(url, this.token, acciones).subscribe(resp => {
      this.modal.dismissAll(); 
      this.loading = false; 
      this.tblData();
      this.servicioaler.disparador.emit(this.servicioaler.getAlert());
    });
   
    return false;
  }

  public modalO(modalIns:any){
    this.modal.open(modalIns);
  }
  
  public guardar(molsDes:any){
    let url       = 'insSubOpc';
    this.carga    = 'invisible';
    this.loading  = true;
    this.val      = true;
    let  acciones = {modulo : this.modulo , molsDes:molsDes , opt:this.optAsig };
    this.serviLoad.sumar.emit(1);
    this.rest.post(url, this.token, acciones).subscribe(resp => {
      this.modal.dismissAll(); 
      this.loading = false; 
      this.tblData();
      this.servicioaler.disparador.emit(this.servicioaler.getAlert());
    });
   
    return false;
  } 

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
