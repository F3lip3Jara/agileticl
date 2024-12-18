import { LoadingService } from './../../../servicios/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from './../../../servicios/rest.service';
import { UsersService } from './../../../servicios/users.service';
import { Pais } from './../../../model/pais.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/servicios/excel.service';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faAddressCard, faFileExcel, faPenToSquare, faPlusCircle, faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trab-pais',
  templateUrl: './trab-pais.component.html',
  styleUrls: ['./trab-pais.component.css']
})
export class TrabPaisComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblPais      : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  pais         : Pais;
  validCod     : boolean              = false;
  dato         : number               = 0;
  ins          : FormGroup;
  up           : FormGroup;
  val          : boolean              = false;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;
  colums      : string []             = [];
  faSyncAlt                           = faSyncAlt;
  constructor(private fb          : FormBuilder,
              private servicio    : UsersService,
              private rest        : RestService,
              private modal       : NgbModal,              
              private excel       : ExcelService,
              private serviLoad   : LoadingService) {

      this.token    = this.servicio.getToken();
      this.pais = new Pais(0, '' , '');


      this.ins = fb.group({
        paiCod : ['' , Validators.compose([
          Validators.required,
         ])],
         paiDes : ['' , Validators.compose([
          Validators.required,
         ])],

      });

      this.up = fb.group({

         paiDes : ['' , Validators.compose([
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
      this.ins.controls['paiCod'].valueChanges.pipe(
        filter(text => text.length > 1),
        debounceTime(200),
        distinctUntilChanged()).subscribe(field => {
        this.validaPais(field);
      });

  }

  public tblData(){
    this.loading = true;
    this.tblPais = {};
    this.serviLoad.sumar.emit(1);
    this.rest.get('trabPais' , this.token, this.parametros).subscribe((data:any) => {      
        this.tblPais = data.data;
        this.colums = data.colums; // Columnas originales   
    });
   
    setTimeout(()=> {
      this.carga = 'visible';
      this.loading = false;
   },1500 );
  
  }

  public modalIns(content : any ){
    this.modal.open(content);
  }

 public modelUp(content :any , xpais: any ){
  this.pais.setId(xpais.paiId);
  this.pais.setPaiDes(xpais.paiDes);
  this.pais.setPaicod(xpais.paiCod);
  this.up.controls['paiDes'].setValue(xpais.paiDes);
  this.modal.open(content);
}

public delPais( gerencia : any) : boolean{
  let url      = 'delPais';
  this.carga   = 'invisible';
  this.loading = true;
  this.serviLoad.sumar.emit(1);
   this.rest.post(url ,this.token, gerencia).subscribe(resp => {   
    this.tblData();
   });
   
   return false;
}

public action(xpaiDes : any , xpaicod : any , tipo :string ) : boolean{
  let url      = '';
  this.carga   = 'invisible';
  this.loading = true;
  this.val     = true;
  let paisx    = new Pais(this.pais.paiId , xpaiDes  , xpaicod );
  if(tipo =='up'){
     url = 'updPais';
  }else{
    url = 'insPais';
  }
  this.serviLoad.sumar.emit(1);
  this.rest.post(url, this.token, paisx).subscribe(resp => {
    this.tblData();
    this.limpiar();
    this.modal.dismissAll();
    this.val = false;
  });

  return false;
}


public Excel(){
  this.excel.exportAsExcelFile(this.tblPais, 'pais');
   return false;
}

public validaPais(paiCod : string){
  this.parametros = [{key :'paiCod' ,value: paiCod.trim()}];
  this.rest.get('valCodPai' , this.token , this.parametros).subscribe((cant : any)=>{
      this.dato =  cant;
      if(this.dato != 0){
        this.validCod = true;
      }else{
        this.validCod = false;
      }
  });
 }


 public limpiar(){
  this.ins.controls['paiDes'].setValue('');
  this.ins.controls['paiCod'].setValue('');
 }
 
 public refrescar(){
  this.parametros = [];
  this.tblData();
}

 public addFilter(parametros: any){
  this.parametros = parametros;
  this.tblData();
}


}
