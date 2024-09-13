import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Roles } from 'src/app/model/rol.model';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { faFileExcel , faAddressCard, faPenToSquare, faTrash, faSquarePlus} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trab-modulos',
  templateUrl: './trab-modulos.component.html',
  styleUrls: ['./trab-modulos.component.css']
})
export class TrabModulosComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblModulo    : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  roles        : Roles;
  carga        : string               = "invisible";
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faTrash                             = faTrash;
  faSquarePlus                        = faSquarePlus;
  optnAsig?    : any []               = [];                
  optAsig?     : any []               = [];
  rolAsig?     : any []               = [];
  rolnAsig?    : any []               = [];
  val                                 = false;

  constructor(private fb            : UntypedFormBuilder,
              private servicio      : UsersService,
              private rest          : RestService,
              private modal         : NgbModal,
              private excel         : ExcelService,
              private serviLoad     : LoadingService,
              private router        : Router
    ) {
      this.token = this.servicio.getToken();
      this.roles = new Roles(0, '');
    }

  ngOnInit(): void {
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
    this.tblModulo = {};
    this.rest.get('trabModule' , this.token, this.parametros).subscribe(data => {
        this.tblModulo = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

   public nuevo(){
    this.router.navigate(['home/seguridad/modulos/insModulo/']);
  } 

 
  public Excel(){
    this.excel.exportAsExcelFile(this.tblModulo, 'modulos');
     return false;
  }

  public up(modulo:any){
    this.val = true;
    this.parametros = [{key: 'empId' , value:modulo.empId } , {key:'molId' , value:modulo.molId}]

    this.rest.get('snAsig', this.token,this.parametros).subscribe((data:any) => {        
          data.forEach((element:any) => {
            this.optnAsig?.push({'optId' : element.optId , 'optDes' : element.optDes , 'movable': true , icon: modulo.molIcon});      
          });

    this.rest.get('asig', this.token,this.parametros).subscribe((data:any) => {
      if(data.opt.length > 0){
        data.opt.forEach((element:any) => {
          this.optAsig?.push({'optId' : element.optId , 'optDes' : element.optDes , 'movable': true ,  icon: modulo.molIcon});      
        });
      }
      if(data.sub.length > 0){
        data.sub.forEach((element:any) => {
            this.optAsig?.push({'optId' : 1 , 'optDes' : element.molsDes , 'movable': false, icon : 'cilReportSlash'});              
        });
      } 

      this.rest.get('asigRol', this.token,this.parametros).subscribe((data:any) => {
        
        data.forEach((element:any) => {
          this.rolAsig?.push({'rolId': element.rolId , 'rolDes': element.rolDes});
        });
        this.rest.get('snAsigRol', this.token,this.parametros).subscribe((data:any) => {
          data.forEach((element:any) => {
            this.rolnAsig?.push({'rolId': element.rolId , 'rolDes': element.rolDes});
          });

          const arrayParametros = {modulo: modulo, optAsig: this.optAsig, optnAsig: this.optnAsig , rolAsig:this.rolAsig , rolnAsi:this.rolnAsig}; 
          const objstring       = btoa(JSON.stringify(arrayParametros));
          this.val = false;
          this.router.navigate(['home/seguridad/modulos/upModulo/' + objstring ]); 
         // console.log(arrayParametros);
          
        });
       
       
       });
      });
    });
  }
 
  public del(modulo:any){
    let url      = 'delModulo';
    this.carga   = 'invisible';
    this.loading = true;
    this.serviLoad.sumar.emit(1);
     this.rest.post(url ,this.token, modulo).subscribe(resp => {
         this.tblData();
         this.loading = false;
     });
    
  }

  subopciones(modulo:any){
    const objstring = JSON.stringify(modulo);
    this.router.navigate(['home/seguridad/modulos/subopciones/' + objstring]);
  }
}
