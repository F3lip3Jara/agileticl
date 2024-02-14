import { LoadingService } from './../../../servicios/loading.service';
import { LogSysService } from './../../../servicios/log-sys.service';
import { LogSys } from './../../../model/logSys.model';
import { AlertasService } from './../../../servicios/alertas.service';
import { UsersService } from 'src/app/servicios/users.service';
import { Component,  OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/servicios/rest.service';
import { Roles } from 'src/app/model/rol.model';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from 'src/app/servicios/excel.service';
import { faAddressCard, faFileExcel, faPenToSquare, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-trab-roles',
  templateUrl: './trab-roles.component.html',
  styleUrls: ['./trab-roles.component.css']
})
export class TrabRolesComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblRoles     : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  roles        : Roles;
  carga        : string               = "invisible";
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;

  constructor(private fb  : UntypedFormBuilder,
    private servicio      : UsersService,
    private rest          : RestService,
    private modal         : NgbModal,
    private excel         : ExcelService,
    private servicioaler  : AlertasService,
    private serLog        : LogSysService,
    private serviLoad     : LoadingService
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
    this.tblRoles = {};
    this.rest.get('trabRoles' , this.token, this.parametros).subscribe(data => {
        this.tblRoles = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

   public modalIns(content : any ){
      this.modal.open(content);
   }

   public modelUp(content :any , xroles: Roles){
     this.roles.setId(xroles.rolId);
     this.roles.setRolDes(xroles.rolDes);
     this.modal.open(content);
   }

   public action(rolDesx : any , tipo :string ) : boolean{
    let url      = '';
    this.carga   = 'invisible';
    this.loading = true;
    let rolesx   = new Roles(this.roles.rolId , rolDesx);  

    if(tipo =='up'){
      url      = 'updRoles';
    }else{
      url      = 'insRoles';
    }

    this.serviLoad.sumar.emit(1);
    this.rest.post(url, this.token, rolesx).subscribe(resp => {
      this.modal.dismissAll(); 
      this.loading = false; 
      this.tblData();
    });

    this.servicioaler.disparador.emit(this.servicioaler.getAlert());
    return false;
  }

  public delRoles( rol : any) : boolean{
     let url      = 'delRoles';
     this.carga   = 'invisible';
     this.loading = true;
     this.serviLoad.sumar.emit(1);
      this.rest.post(url ,this.token, rol).subscribe(resp => {
          this.tblData();
          this.loading = false;
      });
      this.servicioaler.disparador.emit(this.servicioaler.getAlert());
      return false;
  }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblRoles, 'roles');
     return false;
  }

}
