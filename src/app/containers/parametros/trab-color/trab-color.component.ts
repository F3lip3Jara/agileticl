import { LoadingService } from './../../../servicios/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Color } from 'src/app/model/color.model';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faAddressCard, faFileExcel, faPenToSquare, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-trab-color',
  templateUrl: './trab-color.component.html',
  styleUrls: ['./trab-color.component.css']
})
export class TrabColorComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblColor     : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  color        : Color;
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

  constructor(private fb          : FormBuilder,
              private servicio    : UsersService,
              private rest        : RestService,
              private modal       : NgbModal,
              private servicioaler: AlertasService,
              private excel       : ExcelService,
              private serviLoad   : LoadingService) {

      this.token     = this.servicio.getToken();
      this.color     = new Color(0, '' , '');

      this.ins    = fb.group({
        colCod : ['' , Validators.compose([
          Validators.required,
         ])],
         colDes : ['' , Validators.compose([
          Validators.required,
         ])],
      });

      this.up = fb.group({
         colDes : ['' , Validators.compose([
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

    this.ins.controls['colCod'].valueChanges.pipe(
      filter(text => text.length > 2),
      debounceTime(200),
      distinctUntilChanged()).subscribe(field => {
        this.valColCod(field);
      });

  }

  public tblData(){
    this.serviLoad.sumar.emit(1);
    this.tblColor = {};
    this.rest.get('trabColor' , this.token, this.parametros).subscribe(data => {
        this.tblColor = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );
   }

   public modalIns(content : any ){
    this.modal.open(content);
 }

 public modelUp(content :any , xcolor: Color ){
  this.color.setId(xcolor.colId);
  this.color.setcolDes(xcolor.colDes);
  this.color.setcolCod(xcolor.colCod);
  this.up.controls['colDes'].setValue(xcolor.colDes);
  this.modal.open(content);
}

public del( color : any) : boolean{
  let url      = 'delColor';
  this.carga   = 'invisible';
  this.loading = true;
  this.serviLoad.sumar.emit(1);
   this.rest.post(url ,this.token, color).subscribe(resp => {
    this.servicioaler.disparador.emit();
    this.tblData();
   });

   
   return false;
}

public action(xcolDes : any , xcolCod : any , tipo :string ) : boolean{
  let url      = '';
  this.carga   = 'invisible';
  this.loading = true;
  this.val     = true;
  let colorx   = new Color(this.color.colId , xcolDes , xcolCod);

  if(tipo =='up'){
     url      = 'updColor';
  }else{
    url      = 'insColor';
  }
  this.serviLoad.sumar.emit(1);
  this.rest.post(url, this.token, colorx).subscribe(resp => {
      this.servicioaler.disparador.emit();
      this.up.reset();
      this.ins.reset();
      this.modal.dismissAll();      
      this.val      = false;
      this.tblData();
  });

 
  return false;
}


public Excel(){
  this.excel.exportAsExcelFile(this.tblColor, 'color');
   return false;
}

public valColCod(colCod : string){
  this.parametros = [{key :'colCod' ,value: colCod.trim()}];
  this.rest.get('valColCod' , this.token , this.parametros).subscribe((cant : any)=>{
      this.dato =  cant;
      if(this.dato != 0){
        this.validCod = true;
      }else{
        this.validCod = false;
      }
  });
 }


}
