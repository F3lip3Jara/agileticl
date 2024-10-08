import { LoadingService } from './../../../servicios/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grupo } from './../../../model/grupo.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faAddressCard, faFileExcel, faPenToSquare, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-trab-grupo',
  templateUrl: './trab-grupo.component.html',
  styleUrls: ['./trab-grupo.component.css']
})
export class TrabGrupoComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblGrupo     : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  grupo        : Grupo;
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
              private excel       : ExcelService,
              private serviLoad   : LoadingService,
             ) {

      this.token    = this.servicio.getToken();
      this.grupo    = new Grupo(0, '' , '');


      this.ins = fb.group({
        grpCod : ['' , Validators.compose([
          Validators.required,
         ])],
         grpDes : ['' , Validators.compose([
          Validators.required,
         ])],

      });

      this.up = fb.group({

         grpDes : ['' , Validators.compose([
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


    this.ins.controls['grpCod'].valueChanges.pipe(
      filter(text => text.length > 1),
      debounceTime(200),
      distinctUntilChanged()).subscribe(field => {
        this.valGrpCod(field);
      });

  }

  public tblData(){
    this.serviLoad.sumar.emit(1);
    this.tblGrupo = {};
    this.rest.get('trabGrupo' , this.token, this.parametros).subscribe(data => {
        this.tblGrupo = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );
   }

   public modalIns(content : any ){

    this.modal.open(content);

 }

 public modelUp(content :any , xgrupo: Grupo ){
  this.grupo.setId(xgrupo.grpId);
  this.grupo.setgrpDes(xgrupo.grpDes);
  this.grupo.setgrpCod(xgrupo.grpCod);
  this.up.controls['grpDes'].setValue(xgrupo.grpDes);
  this.modal.open(content);
}

public del( grupo : any) : boolean{
  let url      = 'delGrupo';
  this.carga   = 'invisible';
  this.loading = true;
  this.serviLoad.sumar.emit(1);
   this.rest.post(url ,this.token, grupo).subscribe(resp => {
    this.tblData();
    this.loading = false;
   });
   
   return false;
}

public action(xgrpDes : any , xgrpCod : any , tipo :string ) : boolean{
  let url       = '';
  this.carga    = 'invisible';
  this.loading  = true;
  this.val      = true;
  let grupox    = new Grupo(this.grupo.grpId , xgrpDes , xgrpCod);
  
  if(tipo =='up'){
     url      = 'updGrupo';
  }else{
    url       = 'insGrupo';
  }
  this.serviLoad.sumar.emit(1);

  this.rest.post(url, this.token, grupox).subscribe(resp => {
      this.up.reset();
      this.ins.reset();
      this.modal.dismissAll();      
      this.val      = false;
      this.tblData();
  });

  return false;
}


public Excel(){
  this.excel.exportAsExcelFile(this.tblGrupo, 'grupo');
   return false;
}

public valGrpCod(grpCod : string){
  this.parametros = [{key :'grpCod' ,value: grpCod.trim()}];
  this.rest.get('valGrpCod' , this.token , this.parametros).subscribe((cant : any)=>{
      this.dato =  cant;
      if(this.dato != 0){
        this.validCod = true;
      }else{
        this.validCod = false;
      }
  });
 }

}
