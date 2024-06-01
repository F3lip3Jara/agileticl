import { LoadingService } from './../../../../servicios/loading.service';
import { Empleado } from './../../../../model/empleado.model';
import { Component, OnInit } from '@angular/core';
import {   Validators, FormGroup, FormBuilder } from '@angular/forms';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faCalendarWeek, faArrowTurnDown} from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  selector: 'app-ins-user',
  templateUrl: './ins-user.component.html',
  styleUrls: ['./ins-user.component.css']
})
export class InsUserComponent implements OnInit {
  ins              : FormGroup;
  token            : string  = '';
  roles            : any     = {};
  parms            : any     = [];
  val              : boolean = false;
  gerencia         : any     = {};
  validNombre      : boolean = false;
  dato             : number  = 0;
  empresa          : any     = {};
  model: NgbDateStruct | undefined;
  faCalendarWeek            = faCalendarWeek;
  faArrowTurnDown           = faArrowTurnDown;
  imageChangedEvent: any    = '';
  croppedImage     : any    =  '';
  avatar           : any    =  '';

  constructor(fgInsUser            : FormBuilder,
              private servicio     : UsersService,
              private rest         : RestService,
              private serviLoad    : LoadingService,
              private router       : Router
     ) {

      this.ins = fgInsUser.group({
       
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
            
          ])],
        empName : ['' , Validators.compose([
            Validators.required
          ])],
      });

    this.token = this.servicio.getToken();
    
  }

    
    ngOnInit(): void {
      this.serviLoad.sumar.emit(2);
      this.rest.get('trabRoles', this.token , this.parms).subscribe(data => {
      this.roles = data;
   });

   this.rest.get('trabGerencia', this.token , this.parms).subscribe(data => {
     this.gerencia = data;
    });

    this.ins.controls['empName'].valueChanges.pipe(
    filter(text => text.length > 3),
    debounceTime(200),
    distinctUntilChanged()).subscribe(field => {
      this.validaNombre(field);
    });
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
  
  public guardar( nombre: string , apellido: string , fecha: string , rol: number , gerId: number , empName : string){
    this.serviLoad.sumar.emit(1);
    this.val           = true;
    let empleado : any = new Empleado(nombre,apellido,this.avatar,0,fecha,rol,gerId,empName)
    this.rest.post('insUser', this.token , empleado).subscribe(data => {
      this.router.navigate(['home/seguridad/usuarios']);
      this.val = false;       
    });
  }
  
}
