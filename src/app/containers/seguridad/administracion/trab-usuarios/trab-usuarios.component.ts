import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faAddressCard, faCalendarWeek, faFileExcel, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { LogSys } from 'src/app/model/logSys.model';
import { tblUsuario } from 'src/app/model/tblUsuario.model';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-trab-usuarios',
  templateUrl: './trab-usuarios.component.html',
  styleUrls: ['./trab-usuarios.component.scss']
})
export class TrabUsuariosComponent {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;

  @ViewChild('modalRolesUdp') modal: ElementRef | undefined;


  loading         : boolean              = true;
  dtOptions       : DataTables.Settings  = {} ;
  carga           : string               = "invisible";
  tblUsuarios     : any                  = {};
  token           : string               = '';
  parametros      : any []               = [];
  archivos        : any []               = [];
  rol             : any;
  gerencia        : any;
  fileToUpload?   : File;
  usuario         : any                  = {} ;
  valGuar         : boolean              = false;
  udpUser         : FormGroup;
  faFileExcel                            = faFileExcel;
  faAddressCard                          = faAddressCard;
  faPenToSquare                          = faPenToSquare;  
  public visible                         = false;
  model: NgbDateStruct | undefined;
  faCalendarWeek                         = faCalendarWeek;

      
  constructor(
    private servicio        : UsersService,
    private rest            : RestService, 
    private excel           : ExcelService,
    private modalService    : NgbModal,
    private alertas         : AlertasService,
    fgUpUser                : FormBuilder,
    private serLog          : LogSysService,
    private serviLoad       : LoadingService,
    private router          : Router
    ) {
    this.token = this.servicio.getToken();

    this.udpUser = fgUpUser.group({
      empApe : [ '',Validators.compose([
        Validators.required,
       ])],
       empNombre : ['', Validators.compose([
         Validators.required
        ])],
      rol : ['',Validators.compose([
          Validators.required
         ])],
     gerencias : [ '',Validators.compose([
          
        ])]

    });

   }

  ngOnInit(): void {
    this.serviLoad.sumar.emit(3);
    this.tblData();
    this.rest.get('trabRoles', this.token , this.parametros).subscribe(data => {
      this.rol = data;
   });
   this.rest.get('trabGerencia', this.token , this.parametros).subscribe(data => {
     this.gerencia = data;  
  });

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
    this.tblUsuarios = {};
    this.rest.get('trabUsuariosAdm' , this.token, this.parametros).subscribe(data => {
      this.tblUsuarios = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;        
     },1500 );  
    }

   public userNuevo(){
    this.router.navigate(['home/seguridad/administracion/usuarios/ingreso']);
   }


   public Excel(){
    let tblUsuariox : any [] = [];
    this.tblUsuarios.forEach((element : any) => {
        tblUsuariox.push({
          "ID"       : element.id,
          "Usuario"  : element.emploNom,
          "Nombre"   : element.emploApe,
          "Rol"      : element.rolDes,
          "Gerencia" : element.gerDes,
          "Activado" : element.activado,
          "Reinicio" : element.reinicio,
          "Creado"   : element.created_at.substr(0 , 10),
        });
    });

   this.excel.exportAsExcelFile(tblUsuariox, 'usuario');
   return false;
  }


  
  public actualizar(usuario : any){
    const dato = JSON.stringify(usuario);
    this.router.navigate(['home/seguridad/administracion/usuarios/actualizar/' + dato]);
  }
}
