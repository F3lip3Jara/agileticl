import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LinksService } from 'src/app/servicios/links.service';
import { Proveedor } from './../../../../model/proveedor.model';
import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/servicios/loading.service';

@Component({
  selector: 'app-up-proveedor',
  templateUrl: './up-proveedor.component.html',
  styleUrls: ['./up-proveedor.component.css']
})

export class UpProveedorComponent implements OnInit {

  proveedor        : any;
  datPrv           : any;
  up               : FormGroup;
  regiones         : any;
  comunas          : any;
  paises           : any;
  ciudades         : any;
  active                                  = 1;
  token            : string               = '';
  parametros       : any []               = [];
  val              : boolean              = false;
  mensaje          : string               = '';
  escliente        : boolean              = false;
  esproveedor      : boolean              = false;
  prvAct           : boolean              = false;
  paiId                                   = 0;
  regId                                   = 0;
  comId                                   = 0;
  ciuId                                   = 0;
  faArrowTurnDown                         =faArrowTurnDown;

  constructor(private serProveedor : ProveedoresService,
              private rest         : RestService,
              private servicio     : UsersService,
              private servicioLink : LinksService,
              private fg           : FormBuilder,
              private serLog       : LogSysService,
              private route        : ActivatedRoute,
              private serviLoad    : LoadingService,
              private router       : Router
    ) {

      this.token      = this.servicio.getToken();      
      
      this.up = fg.group({
                  prvAct : [ '' , Validators.compose([
                  ])],
                  prvNom : ['' , Validators.compose([
                        Validators.required,
                  ])],
                  prvNom2 : ['', Validators.compose([
                        Validators.required,
                  ])],
                  prvGiro : ['' , Validators.compose([
                    Validators.required,

                  ])],
                  prvDir : ['', Validators.compose([
                    Validators.required,
                  ])],
                  prvDirNum : ['', Validators.compose([
                    Validators.required,

                  ])],
                  paiId : ['', Validators.compose([
                    Validators.required,
                  ])],
                  regId : ['', Validators.compose([
                    Validators.required,
                  ])],
                  ciuId : ['', Validators.compose([
                    Validators.required,
                  ])],
                  comId : ['', Validators.compose([
                      Validators.required,
                  ])],
                  prvCli : ['', Validators.compose([
                  ])],
                  prvPrv: ['' , Validators.compose([
                  ])],
                  prvMail: ['' , Validators.compose([
                    Validators.email,
                  ])],
                  prvTel: ['' , Validators.compose([
                    Validators.required,
                  ])],
       });

       this.paises   = {};
       this.regiones = {};
       this.ciudades = {};
       this.comunas  = {};
   }

  ngOnInit(): void {
    this.serviLoad.sumar.emit(1);
 
    

    this.route.params.subscribe(params => {
      const dato   = params['proveedor'];
      this.proveedor = JSON.parse(dato);

      this.paiId = this.proveedor.paiId;
      this.regId = this.proveedor.regId;
      this.ciuId = this.proveedor.ciuId;
      this.comId = this.proveedor.comId; 
      
      if(this.proveedor.es_cliente == 'S'){
        this.escliente = true;
    }else{
        this.escliente = false;
    }

    if(this.proveedor.activado == 'S'){
      this.prvAct = true;
      }else{
          this.prvAct = false;
    }

    if(this.proveedor.es_proveedor == 'S'){
      this.esproveedor = true;
    }else{
      this.esproveedor = false;
    }

      this.up.controls['prvAct'].setValue(this.prvAct);
      this.up.controls['prvCli'].setValue(this.escliente);
      this.up.controls['prvPrv'].setValue(this.esproveedor);
      this.up.controls['prvNom'].setValue(this.proveedor.nombre);
      this.up.controls['prvNom2'].setValue(this.proveedor.nombre_fantasia);
      this.up.controls['prvGiro'].setValue(this.proveedor.giro);
      this.up.controls['prvDir'].setValue(this.proveedor.direccion);
      this.up.controls['prvDirNum'].setValue(this.proveedor.numero);     
      this.up.controls['prvTel'].setValue(this.proveedor.telefono);
      this.up.controls['prvMail'].setValue(this.proveedor.mail);
    
      this.rest.get('trabPais' , this.token, this.parametros).subscribe((data:any) => {
        this.paises = data.data;
        this.up.controls['paiId'].setValue(this.proveedor.pais_id);
        this.up.controls['regId'].setValue(this.proveedor.region_id);
        this.up.controls['ciuId'].setValue(this.proveedor.ciudad_id);
        this.up.controls['comId'].setValue(this.proveedor.comuna_id);
      });
    });

   
  
  

    this.up.controls['paiId'].valueChanges.subscribe(field => {
      this.regiones = {};
      this.comunas  = {};
      this.ciudades = {};
      this.up.controls['regId'].setValue('');
      this.up.controls['comId'].setValue('');
      this.up.controls['ciuId'].setValue('');
      this.serviLoad.sumar.emit(1);
      this.parametros = [{key :'paiId' ,value: field}];
      this.rest.get('regPai' , this.token, this.parametros).subscribe(data => {
        this.regiones = data;
        });
    });

    this.up.controls['regId'].valueChanges.subscribe(field => {
      if(field > 0){
        this.ciudades= {};
        this.comunas = {};
        this.up.controls['comId'].setValue('');
        this.up.controls['ciuId'].setValue('');
        this.serviLoad.sumar.emit(1);
        this.parametros = [{key :'regId' ,value: field} , {key : 'paiId' , value:  this.up.controls['paiId'].value}];
        this.rest.get('regCiu' , this.token, this.parametros).subscribe(data => {
        this.ciudades = data;
      });
      }
    });

    this.up.controls['ciuId'].valueChanges.subscribe(field => {
      if(field > 0){
        this.comunas = {};
        this.up.controls['comId'].setValue('');
        this.serviLoad.sumar.emit(1);
        this.parametros = [{key :'ciuId' ,value: field} , {key :'regId' , value : this.up.controls['regId'].value } , {key : 'paiId' , value:  this.up.controls['paiId'].value} ];
        this.rest.get('ciuCom' , this.token, this.parametros).subscribe(data => {
          this.comunas = data;
          });
      }
    });
  }

  public guardar(    prvNom    : string ,
                     prvNom2   : string ,
                     prvGiro   : string ,
                     prvDir    : string ,
                     prvNum    : string ,
                     paiId     : number ,
                     regId     : number ,
                     comId     : number ,
                     ciuId     : number ,
                     prvMail   : string ,
                     prvTel    : string ,
                     prvCli    : any    ,
                     prvPrv    : any    ,
                     prvAct    : any    ){

    let xprvAct = true;            
    if(prvCli == true){
        prvCli = 'S';
    }else{
        prvCli = 'N';
    }

    if(prvAct == true){
      prvAct = 'S';
    }else{
      prvAct = 'N';
      xprvAct =false;
    }

    if(prvPrv == true){
        prvPrv = 'S';
    }else{
        prvPrv = 'N';
    }

    let proveedorx : Proveedor  = new Proveedor(this.proveedor.id,this.proveedor.prvRut, prvNom , prvNom2 , prvGiro , prvDir, prvNum, paiId, regId, comId , ciuId , prvMail , prvTel , prvCli , prvPrv , prvAct);
    this.val                    = true;
    this.serviLoad.sumar.emit(1);
    this.rest.post('updProveedor', this.token, proveedorx).subscribe(resp => {  
      this.val                   = false;
      this.up.reset();
      this.router.navigate(['home/parametros/proveedor']);
    });



  }


}
