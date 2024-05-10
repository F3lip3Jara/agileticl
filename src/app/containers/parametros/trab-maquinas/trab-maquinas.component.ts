import { LoadingService } from './../../../servicios/loading.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { Maquinas } from './../../../model/maquinas.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { faAddressCard, faFileExcel, faPenToSquare, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-trab-maquinas',
  templateUrl: './trab-maquinas.component.html',
  styleUrls: ['./trab-maquinas.component.css']
})
export class TrabMaquinasComponent implements OnInit {


  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblMaquinas  : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  maquina      : Maquinas            = new Maquinas(0,'','',0,'','','');
  etapas       : any                  = {};
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;
  ins          : FormGroup;
  up           : FormGroup;
  val                                  = false;

  constructor(
              private servicio    : UsersService,
              private rest        : RestService,
              private modal       : NgbModal,
              private excel       : ExcelService,
              private servicioaler: AlertasService,
              private serviLoad   : LoadingService,
              private serLog      : LogSysService,
              private fb          : FormBuilder) {

      this.token     = servicio.getToken();   
      this.serviLoad.sumar.emit(1);
      
      this.ins = fb.group({
        etaId : ['' , Validators.compose([
          Validators.required,
         ])],
         maqCod : ['' , Validators.compose([
          Validators.required,
         ])],
         maqDes : ['' , Validators.compose([
          Validators.required,
         ])],
      });

      this.up = fb.group({
        maqCod : ['' , Validators.compose([
          Validators.required,
         ])],
         maqDes : ['' , Validators.compose([
          Validators.required,
         ])],
      });



    
    }

  ngOnInit(): void {

    let etapas      = [3,4,5,6,7,8];   
    this.parametros = [{"key": "etapas" , "value" :etapas}];      
    this.rest.get('etapasProd' , this.token, this.parametros).subscribe(data => {
      this.etapas   = data;
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
    this.tblMaquinas = {};
    this.serviLoad.sumar.emit(1);
    this.rest.get('trabMaquinas' , this.token, this.parametros).subscribe(data => {
        this.tblMaquinas = data;
    });

    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }



 public modalIns(content : any ){
    this.modal.open(content);
  }

public modelUp(content :any , maquinas: any){
  this.maquina.setetaId(maquinas.etaId);
  this.maquina.setEtaDes(maquinas.etaDes);
  this.maquina.setmaqId(maquinas.maqId);
  this.maquina.setMaqDes(maquinas.maqDes);
  this.maquina.setMaqCod(maquinas.maqCod);
  this.up.controls['maqDes'].setValue(maquinas.maqDes);
  this.up.controls['maqCod'].setValue(maquinas.maqCod);
  this.modal.open(content);

}

public Excel(){
  this.excel.exportAsExcelFile(this.tblMaquinas, 'maquinas');
  return false;
}

public delEtapas(maquina : any){
  let url      = 'delMaquinas';
  this.carga   = 'invisible';
  this.loading = true;
  this.serviLoad.sumar.emit(1);
   this.rest.post(url ,this.token, maquina).subscribe(resp => {
    this.servicioaler.disparador.emit();
    this.loading=false;
    this.tblData();
   });
  
   return false;
}

public action(  etaId : any , maqId : any , maqDes: any   ,tipo :string , maqCod : string , maqTip: string ){
  let url       = '';
  let  maquinax = new Maquinas(etaId , '','',this.maquina.maqId , maqDes,maqCod,maqTip)
  this.carga    = 'invisible';
  this.loading  = true;
  this.val      = true;

  if(tipo =='up'){
    url      = 'updMaquinas';
    
  }else{
    url      = 'insMaquinas';
   
  }
  this.serviLoad.sumar.emit(1);
  this.rest.post(url, this.token, maquinax).subscribe((resp:any) => {
    this.servicioaler.disparador.emit();   
    this.modal.dismissAll();      
    this.loading = false;
    this.tblData();
    this.ins.reset();
    this.up.reset();
  });

  return false;
}


}
