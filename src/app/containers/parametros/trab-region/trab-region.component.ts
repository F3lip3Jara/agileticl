import { LoadingService } from './../../../servicios/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { Region } from 'src/app/model/region.model';
import { ExcelService } from 'src/app/servicios/excel.service';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faAddressCard, faFileExcel, faPenToSquare, faPlusCircle, faSyncAlt, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trab-region',
  templateUrl: './trab-region.component.html',
  styleUrls: ['./trab-region.component.css']
})
export class TrabRegionComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;
  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblRegion    : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  region       : Region;
  paises       : any                  ={};
  ins          : FormGroup;
  up           : FormGroup;
  val          : boolean              = false;
  dato         : number               = 0;
  validCod     : boolean              = false;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;
  faTrashCan                          = faTrashCan;
  faSyncAlt                           = faSyncAlt;
  colums: string[]                    = [];


  constructor(private fb          : FormBuilder,
              private servicio    : UsersService,
              private rest        : RestService,
              private modal       : NgbModal,
              private excel       : ExcelService,
              private serviLoad   : LoadingService) {

      this.token    = this.servicio.getToken();
      this.region   = new Region(0,'','', 0, '', '');

      this.ins = fb.group({
        paiId : ['' , Validators.compose([
          Validators.required,
         ])],
         regCod : ['' , Validators.compose([
          Validators.required,
         ])],
         regDes : ['' , Validators.compose([
          Validators.required,
         ])],
      });

      this.up = fb.group({
         upregDes : ['' , Validators.compose([
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
      this.serviLoad.sumar.emit(1);
      this.rest.get('trabPais' , this.token, this.parametros).subscribe((data:any) => {
            this.paises = data.data;
        });

      this.ins.controls['regCod'].valueChanges.pipe(
        filter(text => text.length > 1),
        debounceTime(200),
        distinctUntilChanged()).subscribe(field => {
          this.validaRegion(field);
        });

      this.tblData();
  }

  public tblData(){
    this.serviLoad.sumar.emit(1);
    this.tblRegion = {};
    this.rest.get('trabRegion' , this.token, this.parametros).subscribe((data:any) => {
        this.tblRegion = data.data;
        this.colums    = data.colums;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );
   }

   public modalIns(content : any ){
    this.modal.open(content);
 }

 public modelUp(content :any , xregion : Region ){
  this.region.setId(xregion.paiId);
  this.region.setPaiDes(xregion.paiDes);
  this.region.setPaicod(xregion.paiCod);
  this.region.setregDes(xregion.regDes);
  this.region.setregCod(xregion.regCod);
  this.region.setregId(xregion.regId);
  this.up.controls['upregDes'].setValue(xregion.regDes);
  this.modal.open(content);
}

public delRegion (region : any) : boolean{
  let url      = 'delRegion';
  this.carga   = 'invisible';
  this.loading = true;
  this.serviLoad.sumar.emit(1);
  this.rest.post(url ,this.token, region ).subscribe(resp => {
    this.tblData();
  });
   
   return false;
}

public action(xidPai : any , xregDes: any , xregCod : any ,  tipo :string ) : boolean{
  let url      = '';
  this.carga   = 'invisible';
  this.loading = true;
  let paisx    = new Region(this.region.regId , xregDes , xregCod , xidPai , this.region.paiDes, this.region.paiCod);
  this.val     = true;

  if(tipo =='up'){
     url = 'updRegion';
  }else{
    url = 'insRegion';
  }
 this.serviLoad.sumar.emit(1);
 this.rest.post(url, this.token, paisx).subscribe(resp => {
    this.modal.dismissAll();
    this.ins.reset();
    this.tblData();
    this.loading = false;
   });
 
  return false;
}


public Excel(){
  this.excel.exportAsExcelFile(this.tblRegion, 'region');
   return false;
}


public validaRegion(regCod : string){
  this.parametros = [{key :'regCod' ,value: regCod.trim()}];
  this.rest.get('valCodReg' , this.token , this.parametros).subscribe((cant : any)=>{
      this.dato =  cant;
      if(this.dato != 0){

        this.validCod = true;
      }else{
        this.validCod = false;
      }

  });
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
