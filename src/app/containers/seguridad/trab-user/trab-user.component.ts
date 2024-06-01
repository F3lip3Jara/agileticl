import { LoadingService } from './../../../servicios/loading.service';
import { LogSysService } from './../../../servicios/log-sys.service';
import { tblUsuario } from './../../../model/tblUsuario.model';
import { DataTableDirective } from 'angular-datatables';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { Component,  OnInit,  ViewChild , ElementRef } from '@angular/core';
import { FormBuilder,  FormGroup,  Validators } from '@angular/forms';
import {  NgbDateStruct,  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/servicios/excel.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { faFileExcel , faAddressCard, faPenToSquare, faRetweet, faHand, faThumbsUp} from '@fortawesome/free-solid-svg-icons';

import { faCalendarWeek} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trab-user',
  templateUrl: './trab-user.component.html',
  styleUrls: ['./trab-user.component.css']
})
export class TrabUserComponent implements OnInit {
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
  roles           : any;
  gerencia        : any;
  fileToUpload?   : File;
  usuario         : tblUsuario           = new tblUsuario (0 , '', '','','','','','','','', '') ;
  valGuar         : boolean              = false;
  udpUser         : FormGroup;
  faFileExcel                            = faFileExcel;
  faAddressCard                          = faAddressCard;
  faPenToSquare                          = faPenToSquare;  
  public visible                         = false;
  model: NgbDateStruct | undefined;
  faCalendarWeek                         = faCalendarWeek;
  faRetweet                              = faRetweet;
  val                                    = false;
  faHand                                 = faHand;
  faThumbsUp                             = faThumbsUp;
  constructor(
    private servicio        : UsersService,
    private rest            : RestService, 
    private excel           : ExcelService,
    private modalService    : NgbModal,
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
      this.roles = data;
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
    this.rest.get('trabUsuarios' , this.token, this.parametros).subscribe(data => {
      this.tblUsuarios = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;        
     },1500 );  
    }

   public userNuevo(){
    this.router.navigate(['home/seguridad/usuarios/ingreso']);
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
    this.router.navigate(['home/seguridad/usuarios/actualizar/' + dato]);
  } 

  public reiniciar(usuario:any){
    this.carga      = 'invisible';
    this.loading    = true;        
    this.serviLoad.sumar.emit(1);
    let user        = {usrid : usuario.id , name:usuario.name };
    let xuser       = {'user':btoa(JSON.stringify(user))};
    this.val        = true;
    this.rest.post('reiniciar', this.token , xuser).subscribe(data=>{
      this.val = false;
      
      this.tblData();
    });
  }
  public deshabilitar(usuario:any){
    this.serviLoad.sumar.emit(1); 
    this.carga        = 'invisible';
    this.loading      = true;     
     this.tblUsuarios = {}; 
    let user          = {usrid : usuario.id , name:usuario.name };
    let xuser         = {'user':btoa(JSON.stringify(user))};
    this.val          = true;
    this.rest.post('deshabilitar', this.token , xuser).subscribe(data=>{
      this.val = false;
      this.tblData();
    });
  }

  public habilitar(usuario:any){
    this.serviLoad.sumar.emit(1);
    this.carga        = 'invisible';
    this.loading      = true;      
    this.tblUsuarios  = {}; 
    let user          = {usrid : usuario.id , name:usuario.name };
    let xuser         = {'user':btoa(JSON.stringify(user))};
    this.val          = true;
    this.rest.post('habilitar', this.token , xuser).subscribe(data=>{
     
      this.val = false;
      this.tblData();
    });
  }

  
}
