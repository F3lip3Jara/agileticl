import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowTurnDown, faCalendarWeek } from '@fortawesome/free-solid-svg-icons';


import { ImageCroppedEvent } from 'ngx-image-cropper';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';


@Component({
  selector: 'app-up-usuarios',
  templateUrl: './up-usuarios.component.html',
  styleUrls: ['./up-usuarios.component.scss']
})
export class UpUsuariosComponent {
  usuario :any               = {};
  up              : FormGroup;
  token            : string  = '';
  roles            : any     = {};
  parms            : any     = [];
  val              : boolean = false;
  gerencia         : any     = {};
  validNombre      : boolean = false;
  dato             : number  = 0;
  empresa          : any     = {};
  model?: Date ;
  faCalendarWeek            = faCalendarWeek;
  faArrowTurnDown           = faArrowTurnDown;
  imageChangedEvent: any    = '';
  croppedImage     : any    =  '';
  avatar           : any    =  '';
  avatar_val       : number = 0 ;
  password         : boolean= false;
  showPassword     : boolean= false;
  dia              : number  = 0;
  mes              : number  = 0;
  ano              : number  = 0;
  fecha?           : Date;
  dateModel?       : any ;
  date2: Date | undefined;

  constructor(fgUser               : FormBuilder,
              private servicio     : UsersService,
              private rest         : RestService,
              private serviLoad    : LoadingService,
              private router       : Router,
              private route        : ActivatedRoute,
              public datepipe      : DatePipe
     ) {

      this.up = fgUser.group({
       
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
        password : ['' , Validators.compose([
          
          ])],
        password2 : ['' , Validators.compose([
           
          ])],
      });

    this.token = this.servicio.getToken();
    }

  ngOnInit(){
    this.serviLoad.sumar.emit(3);
    this.route.params.subscribe(params => {
      const dato   = params['usuario'];
      this.usuario = JSON.parse(dato);
      let name     = this.usuario.name;
      this.parms = [{key : 'userid', value:this.usuario.id}];     
      this.rest.get('getUsuarios', this.token , this.parms).subscribe((data:any)=>{
        if(data.length > 0 && data != 'error'){
          this.avatar = data[0].emploAvatar;   
          this.avatar_val = 1;   
        }else{      
            this.avatar =name.substring(0,2);
            this.avatar_val = 2;   
        }
      } );
    });

    
    this.parms = [{key : 'empId', value:this.usuario.empId}];
    this.rest.get('trabRolesAdm', this.token , this.parms).subscribe(data => {
      this.roles = data;
      this.up.controls['rol'].setValue(this.usuario.rolId);
   });

   this.rest.get('trabGerenciaAdm', this.token , this.parms).subscribe((data:any) => {
     if(data.length > 0){
        this.gerencia = data;
     }
     this.up.controls['gerencia'].setValue(this.usuario.gerId);
  });
  
 this.fecha      = new Date(this.usuario.emploFecNac);
 this.dia        = this.fecha.getUTCDate();
 this.mes        = this.fecha.getUTCMonth()+1;
 this.ano        = this.fecha.getUTCFullYear();

  
  
  this.up.controls['empApe'].setValue(this.usuario.emploApe);
  this.up.controls['empNombre'].setValue(this.usuario.emploNom);
  this.up.controls['empFecNac'].setValue(this.fecha);

  

  this.up.controls['password'].valueChanges.pipe(
    filter(text => text.length >=1 ),
    debounceTime(200),
    distinctUntilChanged()).subscribe(field => {
        this.up.controls['password2'].setValue('');
        this.password  = false;
    });
  this.up.controls['password2'].valueChanges.pipe(
    filter(text => text.length >= 1),
    debounceTime(200),
    distinctUntilChanged()).subscribe(field => {
        let xpassword = this.up.controls['password'].value;
        if(field === xpassword){
            this.password = false;
        }else{
          this.password = true;
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
  actualizar(emploNom : any , emploApe : any ,  emploPassword : any , rol:any ,empFecNac:any , mantenerPassword:any , gerencia:any ){
      this.serviLoad.sumar.emit(1);
      let user  = {usrid : this.usuario.id , emploNom : emploNom , emploApe: emploApe , avatar: '', emploFecNac:empFecNac, emploPassword:emploPassword, rol:rol , mantenerPassword : mantenerPassword , gerencia:gerencia};
      let xuser = {'user':btoa(JSON.stringify(user))};
      this.val  = true;
      this.rest.post('upUsuario', this.token , xuser).subscribe(data=>{
        this.val = false;
      });
  }
}
