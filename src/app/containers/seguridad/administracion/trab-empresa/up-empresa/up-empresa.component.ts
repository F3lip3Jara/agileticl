import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-up-empresa',
  templateUrl: './up-empresa.component.html',
  styleUrls: ['./up-empresa.component.scss']
})

export class UpEmpresaComponent {

  up              : FormGroup;
  token           : string  = '';
  parametros      : any     = [];
  val             : boolean = false;
  valRut          : boolean = false;
  mensaje         : string  = '';
  faArrowTurnDown           = faArrowTurnDown;
  imageChangedEvent: any    =  '';
  croppedImage     : any    =  '';
  avatar           : any    =  '';
  avatarval                 = 0;
  empresa          :any     = {};
  loading      : boolean    = true;
  carga        : string     = "invisible";
 
  constructor(fgIns                : FormBuilder,
              private servicio     : UsersService,
              private rest         : RestService,          
              private serviLoad    : LoadingService,
              private router       : Router,
              private route        : ActivatedRoute ){

                
                this.token = this.servicio.getToken();             
                
                this.up = fgIns.group({
                  empDes : ['' , Validators.compose([
                    Validators.required,
                   ])],
                   empDir : ['' , Validators.compose([
                     Validators.required
                    ])],
                
                  empGiro : ['', Validators.compose([
                      Validators.required
                     ])],
                  empFono : ['' , Validators.compose([
                      Validators.required
                    ])],
                    empTokenOMS:['']
                });

          
      }

    ngOnInit(){
     
      this.serviLoad.sumar.emit(2);
     
      this.route.params.subscribe(params => {
        let empId = params['empresa'];
        this.parametros = [{key : 'empId', value:empId}];  
        this.rest.get('empresafil', this.token, this.parametros).subscribe((resp:any) => {
            resp.forEach((element:any) => {

              this.empresa = element;
              this.parametros = [{key : 'empresa', value:this.empresa.empId}];  
              this.rest.get('upImg', this.token, this.parametros).subscribe((resp:any) => {
                  resp.forEach((element:any) => {
                      this.avatar = element.empImg;  
                      if(this.avatar.length > 0){
                        this.avatarval =1 ;
                      }
                  });        
              });

              this.up.controls['empDes'].setValue(this.empresa.empDes);
              this.up.controls['empDir'].setValue(this.empresa.empDir);
              this.up.controls['empGiro'].setValue(this.empresa.empGiro);
              this.up.controls['empFono'].setValue(this.empresa.empFono);
              this.up.controls['empTokenOMS'].setValue(this.empresa.empTokenOMS);
            
              setTimeout(()=> {
                this.carga = 'visible';
                this.loading = false;
             },1500 );
            
            });
        });
      });
    }

  public guardar(empDes: any , empDir:any , empGiro:any , empFono:any , empTokenOMS:any ){
    let empRut                 = this.empresa.empRut;
    let empresa                = {empId : this.empresa.empId, empDes: empDes , empDir:empDir , empRut: empRut ,  empGiro:empGiro ,empFono:empFono , empImg:this.avatar , empTokenOMS:empTokenOMS};
    this.val                   = true;
    this.serviLoad.sumar.emit(1);
    this.rest.post('updEmpresa', this.token, empresa).subscribe(resp => {
      this.val = false;
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.blob;     
    this.resizeImage(this.croppedImage).then(resizedImage => {
     // Usa la imagen redimensionada
     this.avatar = resizedImage;
   });
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
          canvas.width  = 100;
          canvas.height = 100;

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
