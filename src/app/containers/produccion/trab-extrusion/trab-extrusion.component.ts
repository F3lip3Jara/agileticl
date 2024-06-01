import { LoadingService } from './../../../servicios/loading.service';
import { ExtrusionService } from './../../../servicios/extrusion.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LinksService } from './../../../servicios/links.service';
import { Component, OnInit } from '@angular/core';
import {faFileExcel,faAddressCard,faPenToSquare,faTrash,faPlusCircle,faSearch,faSyncAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trab-extrusion',
  templateUrl: './trab-extrusion.component.html',
  styleUrls: ['./trab-extrusion.component.css']
})
export class TrabExtrusionComponent implements OnInit {

  dtOptions    : DataTables.Settings  = {} ;
  loading      : boolean              = true;
  tblExtrusion : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string              = "invisible";
  model        : any;
  val          : boolean              = false;
  filtro       : FormGroup;
  rechExt      : FormGroup;
  extProd      : any                  = {};
  extrusion    : any                  = {};
  ver          : string               = '';
  rechazo      : any                  = {};
  aprobExt     :FormGroup;
  isEnabled    : boolean              = true;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;
  faSearch                            = faSearch;
  faSyncAlt                           = faSyncAlt;

  constructor(private linkService  : LinksService,
              private restService  : RestService,
              private userService  : UsersService,
              private modal        : NgbModal,
              private excel        : ExcelService,
              private servicioAlert: AlertasService,
              private fb           : FormBuilder,
              private servicioExtru: ExtrusionService,
              private serviLoad    : LoadingService
                      ) {

          this.filtro = fb.group({
                      lote_salida : ['']
                    });

          this.rechExt = fb.group({
                    extObs    : ['', Validators.compose([
                      Validators.required,
                      ])],
                    idMot : ['', Validators.compose([
                         Validators.required,
                     ])]
            });

             this.aprobExt = fb.group({
                      extObs    : ['', Validators.compose([
                        Validators.required,
                      ])]
            });

          this.token = userService.getToken();
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
  }

  public tblData(){
    let etapas      = [4];   
    this.parametros = [{"key": "etapas" , "value" :etapas}]; 
    this.tblExtrusion = {};
    this.restService.get('motEta', this.token , this.parametros).subscribe(data =>{
      this.rechazo = data
    });

    this.restService.get('trabExtrusion', this.token , this.parametros).subscribe(data =>{
      this.tblExtrusion = data;
    });

     setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );
     this.serviLoad.sumar.emit(2);
  }

  Excel(){
    this.excel.exportAsExcelFile(this.tblExtrusion, 'extrusion');
    return false;
  }

  buscar(lote_salida : string){
    if (lote_salida){
      this.loading      = true;
      let parm : any[]  = [{key :'lote_salida' ,value: lote_salida} ];
      this.tblExtrusion    = {};
      this.serviLoad.sumar.emit(1);
      this.restService.get('filLotSalExt' , this.token, parm).subscribe(respuesta => {
          this.tblExtrusion    = respuesta;
          this.loading      = false;
         });

    }else{
      this.servicioAlert.setAlert('Debe ingresar un filtro', 'warning');
    }
  }


  refrescar(){
    this.tblExtrusion = {};
    this.tblData();
  }
  extNuevo(){
    this.linkService.disparador.emit('insExtru');
  }

  autorizar(content : any, extrusion: any , tipo : string){
    this.extProd       = {};
    this.isEnabled     = true;
    
    if(extrusion.kilos_repro <= 0 ||  extrusion.kilos <=0){
      this.servicioAlert.setAlert('Operación debe ingresar los kilos y kilos de reproceso', 'danger');
    }else{
      if(extrusion.estado_control == 'PENDIENTE' && tipo == 'A'){
        this.isEnabled     = false;
        this.serviLoad.sumar.emit(1);
        this.extrusion     = extrusion;
        this.ver           = tipo;
        this.parametros    = [{key:'idExt' , value: extrusion.id}];
        this.modal.open(content , { size: 'lg' });
        this.restService.get('extDet' , this.token, this.parametros).subscribe(data=>{
          this.extProd = data;
        });
      }else{
        if(extrusion.estado_control == 'APROBADA' && tipo == 'A'){
          this.servicioAlert.setAlert('La Extrusión ya fue autorizada', 'danger');
          }else{
          if(extrusion.estado_control == "RECHAZADA" && tipo == 'A'){
            this.servicioAlert.setAlert('La Extrusión ya fue rechazada', 'danger');
           }else{
              if( tipo == 'V'){
                this.serviLoad.sumar.emit(1);
                this.extrusion  = extrusion;
                this.ver        = tipo;
                this.parametros = [{key:'idExt' , value: extrusion.id}];
                this.modal.open(content , { size: 'lg' });
                this.restService.get('extDet' , this.token, this.parametros).subscribe(data=>{
                  this.extProd = data;
                });
          }
        }
       }
      }
    }
    
    
  }
  confirmar(extrusion: any, extObs: any ){
    console.log(extrusion
      );
    
    let parm   = {id: extrusion.id , extObs : extObs , 'lote_salida' : extrusion.lote_bobina , 'usuario': extrusion.usuario};
    this.serviLoad.sumar.emit(1);
    this.restService.post('confExtru' , this.token, parm).subscribe(data => {
      this.val = true;
        data.forEach((elementx : any)  => {
          if(elementx.error == '0'){
            this.tblData();
            setTimeout(()=> {
              this.val= false;
              this.modal.dismissAll();
              },2000 );
          }else{
            this.val      = false;
          }
        });
    });
  }


  upExtrusion(extrusion : any , tipo : string){
    if(extrusion.estado_control == 'APROBADA'){
      this.servicioAlert.setAlert('La Extrusión ya fue autorizada', 'danger');
    }else{      
        if(extrusion.estado_control == 'PENDIENTE'){
           if(tipo == 'O'){
              this.servicioExtru.setExtrusion(extrusion);
              this.linkService.disparador.emit('upExtruO');
            }else{
              this.servicioExtru.setExtrusion(extrusion);
              this.linkService.disparador.emit('upExtruC');
            }
          }else{
            if(extrusion.estado_control == 'APROBADA'){
              this.servicioAlert.setAlert('La Extrusion ya fue autorizada', 'danger');
            }else{
              if(extrusion.estado_control == "RECHAZADA"){
                this.servicioAlert.setAlert('La Extrusion ya fue rechazada', 'danger');
              }
            }
        }     
    }
   }


   rechazar(content : any , extrusion: any ){
    this.extrusion    = {};
    this.rechExt.controls['extObs'].setValue(extrusion.observaciones);    
    if(extrusion.estado_control == 'PENDIENTE'){
      this.val           = true
      this.extrusion     = extrusion;
      this.parametros    = [{key:'idExt' , value: extrusion.id}];
      this.modal.open(content , { size: 'lg' });
      this.serviLoad.sumar.emit(1);
      this.restService.get('extDet' , this.token, this.parametros).subscribe(data=>{
        this.extProd = data;
        this.val     = false;
      });

    }else{
      if(extrusion.estado_control == 'APROBADA'){
        this.servicioAlert.setAlert('La Extrusion ya fue autorizada', 'danger');
      }else{
        if(extrusion.estado_control == "RECHAZADA"){
          this.servicioAlert.setAlert('La Extrusion ya fue rechazada', 'danger');
        }
      }
     }
    }

  rechExtrusion(idMot : any , extObs: any ){
    let extrusion = {'id': this.extrusion.id , 'idMot': idMot ,  'extObs': extObs , 'lote_salida' : this.extrusion.lote_bobina , 'usuario': this.extrusion.usuario};
    this.val      = true;
    this.serviLoad.sumar.emit(1);
      this.restService.post('rechaExtru' , this.token, extrusion).subscribe(data =>{
        data.forEach((elementx : any)  => {
          if(elementx.error == '0'){
            this.tblData();
            setTimeout(()=> {
              this.val= false;
              this.modal.dismissAll();
              },2000);
          }else{
            this.val      = false;
          }
        });
       });
  }

}
