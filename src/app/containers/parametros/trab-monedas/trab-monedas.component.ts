import { LoadingService } from './../../../servicios/loading.service';
import { Moneda } from './../../../model/moneda.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { faFileExcel , faAddressCard, faPenToSquare, faTrash , faPlusCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trab-monedas',
  templateUrl: './trab-monedas.component.html',
  styleUrls: ['./trab-monedas.component.css']
})
export class TrabMonedasComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblMoneda    : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  moneda       : Moneda;
  validCod     : boolean              = false;
  dato         : number               = 0;
  ins       : FormGroup;
  up        : FormGroup;
  val          : boolean              = false;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;

  constructor(private fb          : FormBuilder,
              private servicio    : UsersService,
              private rest        : RestService,
              private modal       : NgbModal,
              private excel       : ExcelService,
              private serviLoad   : LoadingService,
              private serLog      : LogSysService) {

      this.token    = this.servicio.getToken();
      this.moneda = new Moneda(0, '' , '');


      this.ins = fb.group({
        monCod : ['' , Validators.compose([
          Validators.required,
         ])],
         monDes : ['' , Validators.compose([
          Validators.required,
         ])],

      });

      this.up = fb.group({

         monDes : ['' , Validators.compose([
          Validators.required,
         ])],

      });

    }

  ngOnInit(): void {
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

    this.tblData();
    this.ins.controls['monCod'].valueChanges.pipe(
      filter(text => text.length > 1),
      debounceTime(200),
      distinctUntilChanged()).subscribe(field => {
        this.validaMon(field);
      });

  }

  public tblData(){
    this.tblMoneda = {};
    this.serviLoad.sumar.emit(1);
    this.rest.get('trabMoneda' , this.token, this.parametros).subscribe(data => {
        this.tblMoneda = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public modalIns(content : any ){
    this.modal.open(content);
  }

 public modelUp(content :any , xmoneda: Moneda ){
  this.moneda.setId(xmoneda.monId);
  this.moneda.setmonDes(xmoneda.monDes);
  this.moneda.setmonCod(xmoneda.monCod);
  this.up.controls['monDes'].setValue(xmoneda.monDes);
  this.modal.open(content);
}

public del( moneda : any) : boolean{
  let url      = 'delMoneda';
  this.carga   = 'invisible';
  this.loading = true;
  this.serviLoad.sumar.emit(1);
   this.rest.post(url ,this.token, moneda).subscribe(resp => {
    this.modal.dismissAll();
    this.carga    = 'visible';
    this.loading  = false;
    this.tblData();         
   });
 
   return false;
}

public action(xmonDes : any , xmonCod : any , tipo :string ) : boolean{
  let url      = '';
  this.carga   = 'invisible';
  this.loading = true;
  this.val     = true;
  let monedax  = new Moneda(this.moneda.monId , xmonDes  , xmonCod );

  if(tipo =='up'){
     url      = 'updMoneda';
  }else{
    url       = 'insMoneda';
  }

 this.serviLoad.sumar.emit(1);
 this.rest.post(url, this.token, monedax).subscribe(resp => {
    this.modal.dismissAll();
    this.val      = false;
    this.tblData();    
    this.up.reset();
    this.ins.reset();
  });
 
  return false;
}


public Excel(){
  this.excel.exportAsExcelFile(this.tblMoneda, 'moneda');
   return false;
}

public validaMon(monCod : string){
  this.parametros = [{key :'monCod' ,value: monCod.trim()}];
  this.rest.get('valMonCod' , this.token , this.parametros).subscribe((cant : any)=>{
      this.dato =  cant;
      if(this.dato != 0){
        this.validCod = true;
      }else{
        this.validCod = false;
      }
  });
 }



}
