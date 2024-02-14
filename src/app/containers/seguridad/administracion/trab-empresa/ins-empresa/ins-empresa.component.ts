import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { LinksService } from 'src/app/servicios/links.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-ins-empresa',
  templateUrl: './ins-empresa.component.html',
  styleUrls: ['./ins-empresa.component.scss']
})
export class InsEmpresaComponent {
  ins             : FormGroup;
  token           : string  = '';
  parametros      : any     = [];
  val             : boolean = false;
  valRut          : boolean = false;
  mensaje         : string  = '';
  faArrowTurnDown           = faArrowTurnDown;
 
  constructor(fgIns                : FormBuilder,
              private servicio     : UsersService,
              private rest         : RestService,
              private servicioalert: AlertasService,
              private serviLoad    : LoadingService,
              private router       : Router ){
          

                this.ins = fgIns.group({
                  empDes : ['' , Validators.compose([
                    Validators.required,
                   ])],
                   empDir : ['' , Validators.compose([
                     Validators.required
                    ])],
                  empRut : ['' , Validators.compose([
                    Validators.required,
                    Validators.pattern('^[0-9]+-[0-9kK]{1}')
                     ])],
                  empGiro : ['' , Validators.compose([
                      Validators.required
                     ])],
                  empFono : ['' , Validators.compose([
                      Validators.required
                    ])]
                });

                this.token = this.servicio.getToken();
          
      }

    ngOnInit(){
      this.ins.controls['empRut'].valueChanges.pipe(
        filter(text => text.length > 7),
        debounceTime(200),
        distinctUntilChanged()).subscribe(field => {
          this.parametros = [{key :'prvRut' ,value: field.trim()}];
          this.rest.get('valPrvRut', this.token , this.parametros).subscribe( (data : any) => {
            data.forEach((elementx : any)  => {
              console.log(elementx);
              
                if(elementx.error === '1'  ){
                  this.valRut = true;
                  this.mensaje= '';            
                }else {
                   this.valRut = false;    
                   this.mensaje= 'Rut incorrecto';                               
                }
            });
          });
      });
    }

  public guardar(empDes: any , empDir:any , empRut:any, empGiro:any , empFono:any ){
    let empresa                = {empDes: empDes , empDir:empDir , empRut: empRut ,  empGiro:empGiro ,empFono:empFono};
    this.val                   = true;
    this.serviLoad.sumar.emit(1);

    this.rest.post('insEmpresa', this.token, empresa).subscribe(resp => {
     resp.forEach((elementx : any)  => {
          if(elementx.error == '0' ){           
            this.val = false;
            this.router.navigate(['./..']);         
          }
      });
    });
    this.servicioalert.disparador.emit();
  }
}
