import { LoadingService } from './../../../servicios/loading.service';
import { LogSysService } from './../../../servicios/log-sys.service';
import { LogSys } from './../../../model/logSys.model';
import { Alert } from 'src/app/model/alert.model';
import { AlertasService } from './../../../servicios/alertas.service';
import { UsersService } from 'src/app/servicios/users.service';
import { Component,  OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/servicios/rest.service';
import { Roles } from 'src/app/model/rol.model';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from 'src/app/servicios/excel.service';
import { faAddressCard, faFileExcel, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trab-roles-opciones',
  templateUrl: './trab-roles-opciones.component.html',
  styleUrls: ['./trab-roles-opciones.component.css']
})
export class TrabRolesOpcionesComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblModRol    : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  roles        : any                  = {};
  opciones     : any                  = {};
  carga        : string               = "invisible";
  modulos      : any                  = {};
  insRolMod    : UntypedFormGroup;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faTrash                             = faTrash;

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
      
      this.insRolMod = fb.group({
        idRol : [ '',Validators.compose([
         Validators.required
           ])],
        idMol : ['' , Validators.compose([
             Validators.required,
            ])],
        idOpt : ['' , Validators.compose([
              Validators.required,
             ])]
          });
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
    this.serviLoad.sumar.emit(5);

    this.rest.get('trabRoles' , this.token, this.parametros).subscribe(data => {
        this.roles  = data;
    });

    this.rest.get('trabModule' , this.token, this.parametros).subscribe(data => {
      this.modulos  = data;
    });

    this.rest.get('trabOpciones' , this.token, this.parametros).subscribe(data => {
      this.opciones  = data;
  });
 
 
    this.tblModRol = {};
    this.rest.get('trabRolOpt' , this.token, this.parametros).subscribe(data => {
        this.tblModRol = data;
    });


    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },500 );
   }

   public modalIns(content : any ){
      this.modal.open(content);
   }

   public modelUp(content :any , xroles: Roles){
     this.roles.setId(xroles.idRol);
     this.roles.setRolDes(xroles.rolDes);
     this.modal.open(content);
   }

   public action(idRol : any , idMol :any , idOpt :any, tipo : string ) : boolean{

   
    let url      = '';
    this.carga   = 'invisible';
    this.loading = true;
    let des      = '';
    let idEtaDes = 0;
    let lgDes    = '';

    if(tipo =='up'){
      url      = 'updRolOpt';
    }else{
      url      = 'insRolOpt';
    }

  this.serviLoad.sumar.emit(2);


  let parm = {'idRol' : idRol , 'idMol':idMol, 'idOpt': idOpt};
  
  this.rest.post(url, this.token, parm ).subscribe(resp => {
        resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.modal.dismissAll();
            setTimeout(()=>{
              this.tblModRol = {};
              this.rest.get('trabRolOpt' , this.token, this.parametros).subscribe(data => {
                  this.tblModRol = data;
              });
              this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
                dtInstance.destroy().draw();
              });
              this.carga             = 'visible';
              this.loading           = false;
              const log  : LogSys    = new LogSys(1, '' , idEtaDes, lgDes  , des);
              this.serLog.insLog(log);
            },1500);
        }else {
          this.carga    = 'visible';
          this.loading  = false;
        }
      });
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
          resp.forEach((elementx : any)  => {
            if(elementx.error == '0'){
              this.modal.dismissAll();
              setTimeout(()=>{
                this.serviLoad.sumar.emit(1);
                this.tblModRol = {};
                this.rest.get('trabRolesMod' , this.token, this.parametros).subscribe(data => {
                    this.tblModRol = data;
                });
                this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
                  dtInstance.destroy().draw();
                });
                this.carga     = 'visible';
                this.loading   = false;
                let des        = 'Rol ' + rol.rolDes + ' fue eliminado.'
                let log        = new LogSys(1, '' , 8 , 'ELIMINAR ROL' , des);
                this.serLog.insLog(log);
              },1500);
            }else{
              this.carga    = 'visible';
              this.loading  = false;
            }
          });
      });
      this.servicioaler.disparador.emit(this.servicioaler.getAlert());
      return false;
  }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblModRol, 'roles-modulos');
     return false;
  }
}
