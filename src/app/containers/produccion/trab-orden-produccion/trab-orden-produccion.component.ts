import { Observable, merge } from 'rxjs';
import { AlertasService } from './../../../servicios/alertas.service';
import { RestService } from './../../../servicios/rest.service';
import { UsersService } from './../../../servicios/users.service';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/servicios/excel.service';
import { faAddressCard, faArrowTurnDown, faBuildingCircleArrowRight, faEye, faFileExcel, faFilter, faPenToSquare, faSquarePlus, faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trab-orden-produccion',
  templateUrl: './trab-orden-produccion.component.html',
  styleUrls: ['./trab-orden-produccion.component.css']
})
export class TrabOrdenProduccionComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;
 

  dtOptions    : DataTables.Settings  = {} ;
  loading      : boolean              = true;
  tblOrdenPrd  : any                  = {};
  producto     : any                  = {};
  filtroOp     : UntypedFormGroup;
  token        : string               = '';
  parametros   : any []               = [];
  statesx      : any                  ;
  states       : string[]             = [];
 // upPrd        : FormGroup             ;
  carga        : string               = "invisible";
  model        : any;
  xorden       : any;
  xorddet      : any                  = {};
  ot           : any []               = [];
  val          : boolean              = false;
  cargad       : boolean              = false;
  valJul       : boolean              = false;
  valEqui      : boolean              = true;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faSquarePlus                        = faSquarePlus;
  faTrash                             = faTrash;
  faArrowTurnDown                     = faArrowTurnDown;
  faSyncAlt                           = faSyncAlt;
  faEye                               = faEye; 
  faBuildingCircleArrowRight          = faBuildingCircleArrowRight;
  faFilter                            = faFilter;
  
  colums     :string []               = [];




  constructor(private servicio     : UsersService ,
              private servicioget  : RestService,
              private modal        : NgbModal,
              private fb           : FormBuilder,
              private excel        : ExcelService,
              private router       : Router,
              private servicioAlert: AlertasService
    ) {

      this.filtroOp = fb.group({
        orpNumRea : ['']

      });
      this.token = this.servicio.getToken();
    }

  



ngOnInit(): void {
  this.tblData();
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 50,
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
    this.parametros = [];
}


ngAfterViewInit(): void {
}
 
  public tblData(){
    this.tblOrdenPrd = {};
    this.servicioget.get('trabOrdenProduccion' , this.token, this.parametros).subscribe((respuesta: any) => {
      this.tblOrdenPrd = respuesta.data;
      this.colums      = respuesta.colums;
     });

     setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1000 );
  }

  public Excel(){
      this.excel.exportAsExcelFile(this.tblOrdenPrd, 'orden_producción');
      return false;
  }

  public ordNuevo(){
    this.router.navigate(['home/produccion/ordenProduccion/ingreso']);
 }

 /*addOT(orden: any , content : any){

  if(this.valJul){
    this.servicioAlert.setAlert('Debe ingresar calendario juliano', 'warning');
  }else{   
    this.xorden       = orden ;
    let idOrp         = this.xorden.id ;
    let parm : any[]  = [{key :'idOrp' ,value: idOrp} ];
    this.xorddet      = {};
    this.cargad       = false;
   

    this.servicioget.get('OrdPDetDta' , this.token, parm).subscribe(respuesta => {
          this.xorddet = respuesta; 
          this.valEqui = false;             
          this.xorddet.forEach((element:any) => {
            let parm : any[]  = [{key :'prdCod' ,value: element.orpdPrdCod} ];
            this.servicioget.get('valEquiPrd' , this.token, parm).subscribe(respuesta => {
              console.log(respuesta);
              if(respuesta == "error"){
                this.valEqui = true;        
                console.log(this.valEqui);                    
              }                        
            });                  
          }); 
          this.cargad  = true;    
      });    

      this.ot          = [];
     
       
        if(this.valEqui){
          this.servicioAlert.setAlert('Productos sin equivalencia', 'warning');
        }else{
          this.modal.open(content , { size: 'xl' });
        }    
    

    }
 }*/

 /*argrerDet(ord : any  , valor: any){
   if(valor['checked'] == true){      
      this.ot.push(ord);    
   }else{
      let orpdPrdCod = ord.orpdPrdCod;
      let count      = 0;
     this.ot.forEach((element : any) => {
          if(element.orpdPrdCod == orpdPrdCod) {
                this.ot.splice(count , 1);
          }
          count= count + 1;
      });
   }
 }*/

 /*guardarOT(idOrp : any , orptPrio: any ){
  console.log(this.valEqui);
    let ordenTrab: any [] = [];
    this.val              = true;
    ordenTrab.push({ 'idOrp'    : idOrp, 'orptPrio' : orptPrio,'otdet': this.ot });
     this.servicioget.post('insOT', this.token, ordenTrab).subscribe(resp => {       
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            setTimeout(()=>{
              this.servicioAlert.setAlert('','');
              this.val      = false;
            },3000);
           this.ot    = [];
          this.modal.dismissAll();
          this.refrescar();
        }else {
          this.val      = false;
        }
      });
  });
 }*/

  generaSalida(ot : any ){
    this.xorden = ot;
    let parm : any[] = [{key :'orpId' ,value: ot.id}];
    
    // Primero obtenemos xorddet
    this.servicioget.get('OrdPDet', this.token, parm).subscribe(respuesta => {
        this.xorddet = respuesta;
        
        // Una vez que tenemos xorddet, lo agregamos al ot
        ot.detalles = this.xorddet;
        
        // Ahora hacemos el post con el ot actualizado
        this.servicioget.post('insSdOrden', this.token, ot).subscribe(respuesta => {
            // Manejar respuesta si es necesario
        });
    });
  }

 verOT(ot : any , content : any){
   this.xorden       = ot ;
   let idOrp         = this.xorden.id ;
   let parm : any[]  = [{key :'orpId' ,value: idOrp} ];
   this.xorddet      = {};
   this.cargad       = false;
   this.servicioget.get('OrdPDet' , this.token, parm).subscribe(respuesta => {
        this.xorddet = respuesta;
        this.cargad  = true;
    });    
    this.ot          = [];
    this.modal.open(content , { size: 'xl' });
 }
 

public refrescar(){
  this.parametros = [];
  this.tblData();}
  public addFilter(parametros: any){
  this.parametros = parametros;
  this.tblData();
}


}
