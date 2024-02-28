import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { LoadingService } from 'src/app/servicios/loading.service';
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
  imageChangedEvent: any    = '';
  croppedImage     : any    =  '';
  avatar           : any    =  '';
 
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
    let empresa                = {empDes: empDes , empDir:empDir , empRut: empRut ,  empGiro:empGiro ,empFono:empFono , empImg:this.avatar};
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.blob;   
    var myReader: FileReader = new FileReader();
     myReader.readAsDataURL(this.croppedImage);
     myReader.onloadend = (event) => {
      this.avatar =event.target?.result;
     }
  }

  imageLoaded(): void {
    // Imagen cargada
  }

  cropperReady(): void {
    // El recortador está listo
  }

  loadImageFailed(): void {
    this.avatar = '';
    this.croppedImage = '';
  }

  resizeImage(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Ajusta el tamaño deseado, por ejemplo, 800x600
          canvas.width  = 800;
          canvas.height = 600;

          // Dibuja la imagen en el lienzo
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convierte el lienzo a base64
          const resizedImage = canvas.toDataURL('image/jpeg');

          resolve(resizedImage);
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.readAsDataURL(file);
    });
  }
}
