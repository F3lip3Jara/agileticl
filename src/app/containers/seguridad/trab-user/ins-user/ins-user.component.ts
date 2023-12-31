import { LoadingService } from './../../../../servicios/loading.service';
import { LogSys } from './../../../../model/logSys.model';
import { LogSysService } from './../../../../servicios/log-sys.service';
import { Alert } from 'src/app/model/alert.model';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Empleado } from './../../../../model/empleado.model';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LinksService } from 'src/app/servicios/links.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faCalendarWeek, faArrowTurnDown} from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ins-user',
  templateUrl: './ins-user.component.html',
  styleUrls: ['./ins-user.component.css']
})
export class InsUserComponent implements OnInit {

  insUser         : UntypedFormGroup;
  token           : string  = '';
  previsualizador : any  = null ;
  roles           : any     = {};
  parms           : any     = [];
  val             : boolean = false;
  gerencia        : any     = {};
  validNombre     : boolean = false;
  dato            : number  = 0;

  model: NgbDateStruct | undefined;
  faCalendarWeek            = faCalendarWeek;
  faArrowTurnDown           = faArrowTurnDown;


  constructor(fgInsUser  : UntypedFormBuilder,
    private servicio     : UsersService,
    private rest         : RestService,
    private servicioLink : LinksService,
    private alertas      : AlertasService,
    private serLog       : LogSysService,
    private serviLoad    : LoadingService,
    private router       : Router
     ) {

      this.insUser = fgInsUser.group({
        empApe : ['' , Validators.compose([
          Validators.required,
         ])],
         empNombre : ['' , Validators.compose([
           Validators.required
          ])],
        empFecNac : ['' , Validators.compose([
           ])],
        rol : ['' , Validators.compose([
            Validators.required
           ])],
        gerencia : ['' , Validators.compose([
            Validators.required
          ])],
        empName : ['' , Validators.compose([
            Validators.required
          ])],
      });

    this.token = this.servicio.getToken();
    }


    public guardar(nombre: string , apellido: string , fecha: string , rol: number , gerId: number , empName : string){
      this.serviLoad.sumar.emit(1);
      this.val= true;
      let empleado : Empleado = new Empleado(nombre, apellido, this.previsualizador , 1 , fecha , rol , gerId, empName);
      this.rest.post('insUser', this.token , empleado).subscribe(data => {
         data.forEach((element : any) => {
              if(element.error == '0' ){              
                let   des    : string = 'Usuario creado ' + empName;
                const log    : LogSys = new LogSys(1, '' , 2 , 'INGRESO DE USUARIO' , des);
                this.serLog.insLog(log);
                this.router.navigate(['home/seguridad/usuarios']);
              }else{              
                this.val=false;
              }
          });
      });
      this.alertas.disparador.emit();          

    }



  ngOnInit(): void {
    this.serviLoad.sumar.emit(2);

    this.rest.get('trabRoles', this.token , this.parms).subscribe(data => {
      this.roles = data;
   });

   this.rest.get('trabGerencia', this.token , this.parms).subscribe(data => {
     this.gerencia = data;
  });

  this.insUser.controls['empName'].valueChanges.pipe(
    filter(text => text.length > 3),
    debounceTime(200),
    distinctUntilChanged()).subscribe(field => {
      this.validaNombre(field);
    });

  }

  capturarFile (event : any){
    const archivoCapturado = event.target.files[0];
    try {
     var myReader: FileReader = new FileReader();
     myReader.readAsDataURL(archivoCapturado);
     myReader.onloadend = (event) => {
       this.previsualizador  =event.target?.result;
     }
   }
   catch(e: any){
     console.log(e);
   }
  }

  

  public validaNombre(name : string){

    this.parms        = [{key :'emploName' ,value: name.trim()}];

    this.rest.get('valUsuario' , this.token , this.parms).subscribe((cant : any)=>{
        this.dato =  cant;
        if(this.dato != 0){

          this.validNombre = true;
        }else{
          this.validNombre = false;
        }

    });



  }

 
}
