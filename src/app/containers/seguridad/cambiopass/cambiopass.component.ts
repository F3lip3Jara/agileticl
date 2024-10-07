import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowTurnDown, faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-cambiopass',
  templateUrl: './cambiopass.component.html',
  styleUrls: ['./cambiopass.component.scss']
})
export class CambiopassComponent {
    
  usuario :any               = {};
  up               : FormGroup;
  token            : string  = '';
  parms            : any     = [];
  val              : boolean = false;
  validNombre      : boolean = false;
  dato             : number  = 0;
  empresa          : any     = {};
  model: NgbDateStruct | undefined;
  faCalendarWeek            = faCalendarWeek;
  faArrowTurnDown           = faArrowTurnDown;
  imageChangedEvent: any    = '';
  croppedImage     : any    =  '';
  avatar           : string = '';
  password         : boolean= false;
  showPassword     : boolean= false;
  dia              : number  = 0;
  mes              : number  = 0;
  ano              : number  = 0;
  fecha?           : Date;
  dateModel?       : NgbDateStruct ;
  show             : boolean = false;
  

  constructor(fgUser               : FormBuilder,
              private servicio     : UsersService,
              private rest         : RestService,
              private serviLoad    : LoadingService,
              private router       : Router,
              private route        : ActivatedRoute,
              private render       : Renderer2
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
        password : ['' , Validators.compose([
          
          ])],
        password2 : ['' , Validators.compose([
           
          ])],
      });

    this.token = this.servicio.getToken();
    
  }

  ngOnInit(){
    this.serviLoad.sumar.emit(1);
    this.render.setStyle(document.body, 'background-color', '#EBEDEF');
    let parm : any[] =[];
  
    
  this.rest.get('getUsuario', this.token , parm).subscribe((data:any) => {
    data.forEach((element:any) => {      
      this.usuario = element;
      if(this.usuario.reinicio =='NO'){
        this.router.navigate(['./login']);
      }else{
        let name     = this.usuario.name;
        this.avatar  =   name.substring(0,2);

        this.parms = [{key : 'userid', value:this.usuario.id}];

          this.rest.get('getUsuarios', this.token , this.parms).subscribe((data:any) => {
            if(data[0].emploAvatar != null ){
              this.avatar = data[0].emploAvatar;      
            }
          });
          let emploFecNAc = this.usuario.emploFecNac;
          this.fecha      = new Date(emploFecNAc);
          this.dia        = this.fecha.getUTCDate();
          this.mes        = this.fecha.getUTCMonth()+1;
          this.ano        = this.fecha.getUTCFullYear();
          this.dateModel  = { year: this.ano, month: this.mes, day: this.dia };
        
          this.up.controls['empApe'].setValue(this.usuario.emploApe);
          this.up.controls['empNombre'].setValue(this.usuario.emploNom);
          this.up.controls['empFecNac'].setValue(this.fecha);
          this.show = true;
      }
     
      });
  });
  
  
  
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
    this.resizeImage(this.croppedImage).then((resizedImage:any) => {
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


  actualizar(emploNom : any , emploApe : any ,  emploPassword : any , empFecNac:any , mantenerPassword:any  ){
      let user  = {usrid : this.usuario.id , emploNom : emploNom , emploApe: emploApe , avatar: this.avatar , emploFecNac:empFecNac, emploPassword:emploPassword, rol:0 , mantenerPassword : mantenerPassword , gerencia:null};
      let xuser = {'user':btoa(JSON.stringify(user))};
      this.val  = true;
      this.up.enable();
      this.rest.post('upUsuario', this.token , xuser).subscribe(data=>{ 
        if(data[0].error == 0){ 
          setTimeout(()=> {
            this.val  = false;
            this.router.navigate(['./login']);
         },3500 );  
         
        }
       
      });
  }
}
