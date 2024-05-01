import { LoadingService } from './../../../servicios/loading.service';
import { Comuna } from './../../../model/comuna.model';
import { Region } from 'src/app/model/region.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faAddressCard, faFileExcel, faPenToSquare, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-trab-comuna',
  templateUrl: './trab-comuna.component.html',
  styleUrls: ['./trab-comuna.component.css']
})
export class TrabComunaComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblComuna    : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  regiones     : any;
  paises       : any;
  comuna       : Comuna;
  ins          : FormGroup;
  up           : FormGroup;
  val          : boolean              = false;
  dato         : number               = 0;
  validCod     : boolean              = false;
  ciudades     : any;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;


  constructor(private fb            : FormBuilder,
              private servicio      : UsersService,
              private rest          : RestService,
              private modal         : NgbModal,
              private servicioaler  : AlertasService,
              private excel         : ExcelService,
              private serviLoad     : LoadingService) {

      this.token     = this.servicio.getToken();

      this.ins = fb.group({
         paiId : ['' , Validators.compose([
          Validators.required,
         ])],
         regId : ['' , Validators.compose([
          Validators.required,
         ])],
         ciuId : ['' , Validators.compose([
          Validators.required,
         ])],

         comCod : ['' , Validators.compose([
          Validators.required,
         ])],
         comDes : ['' , Validators.compose([
          Validators.required,
         ])],
      });

      this.up = fb.group({
          upcomDes : ['' , Validators.compose([
          Validators.required,
         ])]

      });
      this.regiones = {};
      this.paises   = {};
      this.ciudades = {};
      this.comuna = new Comuna(0, '', '' , 0 , '' , '',0,'','',0 , '' , '');

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
      this.rest.get('trabPais' , this.token, this.parametros).subscribe(data => {
        this.paises = data;
        });

        this.ins.controls['paiId'].valueChanges.subscribe(field => {
          this.regiones = {};
          this.parametros = [{key :'paiId' ,value: field}];
          this.rest.get('regPai' , this.token, this.parametros).subscribe(data => {
            this.regiones = data;
            });
        });

        this.ins.controls['regId'].valueChanges.subscribe(field => {
          this.ciudades   = {};
          this.parametros = [{key :'regId' ,value: field} , {key:'paiId' , value: this.ins.controls['paiId'].value}];
          this.rest.get('regCiu' , this.token, this.parametros).subscribe(data => {
            this.ciudades = data;
            });
        });
        this.ins.controls['comCod'].valueChanges.pipe(
          filter(text => text.length >=2),
          debounceTime(200),
          distinctUntilChanged()).subscribe(field => {
          this.validaRegion(field);
        });
      this.tblData();
  }




  public tblData(){
    this.serviLoad.sumar.emit(1);
    this.tblComuna = {};
    this.rest.get('trabComuna' , this.token, this.parametros).subscribe(data => {
        this.tblComuna = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );
   }

   public modalIns(content : any ){
    this.modal.open(content);
 }

 public modelUp(content :any , xcomuna : Comuna ){
  this.comuna.setId(xcomuna.paiId);
  this.comuna.setPaiDes(xcomuna.paiDes);
  this.comuna.setPaicod(xcomuna.paiCod);
  this.comuna.setregDes(xcomuna.regDes);
  this.comuna.setregId(xcomuna.regId);
  this.comuna.setciuId(xcomuna.ciuId);
  this.comuna.setcomId(xcomuna.comId);
  this.comuna.setcomCod(xcomuna.comCod);
  this.up.controls['upcomDes'].setValue(xcomuna.comDes);
  this.modal.open(content);
}

public delComuna (comuna : any) : boolean{
  let url      = 'delComuna';
  this.carga   = 'invisible';
  this.loading = true;
  this.serviLoad.sumar.emit(1);
   this.rest.post(url ,this.token, comuna ).subscribe(resp => {
    this.servicioaler.disparador.emit();
    this.tblData();
    this.modal.dismissAll();
   });
   return false;
}

public action(xpaiId : any , xregId : any ,xciuIdd : any , xcomCod : any , xcomDes : any , tipo : string ) : boolean{
  let url      = '';
  this.carga   = 'invisible';
  this.loading = true;
  let xcomuna  = new Comuna(this.comuna.comId , xcomDes , xcomCod , xpaiId , '','', xregId , '','',xciuIdd ,'', '');
  this.val     = true;

  if(tipo =='up'){
     url = 'updComuna';
  }else{
    url = 'insComuna';
  }
  this.serviLoad.sumar.emit(1);
 this.rest.post(url, this.token, xcomuna).subscribe(resp => {
      this.val      = false;     
      this.tblData();
      this.ins.reset();
       this.servicioaler.disparador.emit();
  }); 
  return false;
}


public Excel(){
  this.excel.exportAsExcelFile(this.tblComuna, 'comuna');
   return false;
}


public validaRegion(comCod : string){
  this.parametros = [{key :'comCod' ,value: comCod.trim()}];
  this.rest.get('valCodComuna' , this.token , this.parametros).subscribe((cant : any)=>{
      this.dato =  cant;
      if(this.dato != 0){

        this.validCod = true;
      }else{
        this.validCod = false;
      }

  });
 }

}
