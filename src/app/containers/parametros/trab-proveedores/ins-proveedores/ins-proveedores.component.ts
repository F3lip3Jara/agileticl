import { LoadingService } from './../../../../servicios/loading.service';
import { LinksService } from './../../../../servicios/links.service';
import { Proveedor } from './../../../../model/proveedor.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { Router } from '@angular/router';
import { faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ins-proveedores',
  templateUrl: './ins-proveedores.component.html',
  styleUrls: ['./ins-proveedores.component.css']
})
export class InsProveedoresComponent implements OnInit {
  ins      : FormGroup;
  regiones     : any;
  comunas      : any;
  paises       : any;
  ciudades     : any;
  loading      : boolean              = true;
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  val          : boolean              = false;
  valRut       : boolean              = false;
  mensaje      : string               = '';
  faArrowTurnDown                     = faArrowTurnDown;

  constructor( private fg                 : FormBuilder,
              private servicio            : UsersService,
              private rest                : RestService,
              private servicioLink        : LinksService,
              private serviLoad           : LoadingService,
              private serLog              : LogSysService,
              private router              : Router
  ) {

  this.ins = fg.group({
     prvRut : [ '',Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]+-[0-9kK]{1}')
        ])],
     prvNom : ['' , Validators.compose([
          Validators.required,
         ])],
    prvNom2 : ['' , Validators.compose([
         Validators.required,
    ])],
    prvGiro : ['' , Validators.compose([
      Validators.required,

    ])],
    prvDir : ['' , Validators.compose([
      Validators.required,
    ])],
    prvDirNum : ['' , Validators.compose([
      Validators.required,

    ])],
    paiId : ['' , Validators.compose([
      Validators.required,
    ])],
    regId : ['' , Validators.compose([
      Validators.required,
    ])],
    comId : ['' , Validators.compose([
      Validators.required,
     ])],
    ciuId : ['' , Validators.compose([
      Validators.required,
     ])],
     prvCli : ['' , Validators.compose([

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
    this.comunas  = {};
    this.ciudades = {};

    this.token     = this.servicio.getToken();
   }

  ngOnInit(): void {
    this.serviLoad.sumar.emit(1);
    this.rest.get('trabPais' , this.token, this.parametros).subscribe((data:any) => {
      this.paises = data.data;
      });

      this.ins.controls['paiId'].valueChanges.subscribe(field => {
        this.regiones = {};
        this.comunas = {};
        this.ciudades = {};
        this.ins.controls['regId'].setValue('');
        this.ins.controls['comId'].setValue('');
        this.ins.controls['ciuId'].setValue('');
      
          if(field != null){
            this.serviLoad.sumar.emit(1);
            this.parametros = [{key :'paiId' ,value: field}];
            this.rest.get('regPai' , this.token, this.parametros).subscribe(data => {
              this.regiones = data;
            });
          }
         
        
      });

      this.ins.controls['regId'].valueChanges.subscribe(field => {
        if(field != null){
          this.ciudades= {};
          this.comunas = {};
          this.ins.controls['comId'].setValue('');
          this.ins.controls['ciuId'].setValue('');
          this.serviLoad.sumar.emit(1);
          this.parametros = [{key :'regId' ,value: field} , {key : 'paiId' , value:  this.ins.controls['paiId'].value}];
          this.rest.get('regCiu' , this.token, this.parametros).subscribe(data => {
          this.ciudades = data;
        });
        }
      });

      this.ins.controls['ciuId'].valueChanges.subscribe(field => {
        if(field != null){
          this.comunas = {};
          this.ins.controls['comId'].setValue('');
          this.serviLoad.sumar.emit(1);
          this.parametros = [{key :'ciuId' ,value: field} , {key :'regId' , value : this.ins.controls['regId'].value } , {key : 'paiId' , value:  this.ins.controls['paiId'].value} ];
          this.rest.get('ciuCom' , this.token, this.parametros).subscribe(data => {
            this.comunas = data;
            });
        }
      });

      this.ins.controls['prvRut'].valueChanges.pipe(
        filter(text => text.length > 7),
        debounceTime(200),
        distinctUntilChanged()).subscribe(field => {
          this.parametros = [{key :'prvRut' ,value: field.trim()}];
          this.rest.get('valPrvRut', this.token , this.parametros).subscribe( (data : any) => {
            data.forEach((elementx : any)  => {
                if(elementx.error == 1  ){
                  this.valRut = false;
                  this.mensaje= '';                 
                }else {
                   this.valRut = true;
                   this.mensaje= elementx.mensaje;                   
                }
            });
          });
      });
  }

 public guardar(prvRut    : string ,
                prvNom    : string ,
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
                prvPrv    : any
  ){

    if(prvCli == true){
        prvCli = 'S';
    }else{
        prvCli = 'N';
    }

    if(prvPrv == true){
        prvPrv = 'S';
    }else{
        prvPrv = 'N';
    }
    let proveedor : Proveedor  = new Proveedor(0,prvRut, prvNom , prvNom2 , prvGiro , prvDir, prvNum, paiId, regId, comId , ciuId , prvMail , prvTel , prvCli , prvPrv , true);
    this.val                   = true;
    this.serviLoad.sumar.emit(1);

    this.rest.post('insProveedor', this.token, proveedor).subscribe(resp => {
      this.val                   = false;
      this.ins.reset();
      this.router.navigate(['home/parametros/proveedor']);
    });
  }

}
