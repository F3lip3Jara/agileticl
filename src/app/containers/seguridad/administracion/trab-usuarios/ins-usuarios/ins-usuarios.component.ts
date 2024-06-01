import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowTurnDown, faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct, NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { Empleado } from 'src/app/model/empleado.model';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-ins-usuarios',
  templateUrl: './ins-usuarios.component.html',
  styleUrls: ['./ins-usuarios.component.scss'],
  
})
export class InsUsuariosComponent {
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
        empId  : ['' , Validators.compose([
          Validators.required,
         ])],
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

    public guardar(empId:number, nombre: string , apellido: string , fecha: string , rol: number , gerId: number , empName : string){
      this.serviLoad.sumar.emit(1);
      this.val          = true;
      let empleado : any = new Empleado(nombre,apellido,this.avatar,empId,fecha,rol,gerId,empName)
      this.rest.post('insUserAdm', this.token , empleado).subscribe(data => {
        this.val          = true; 
        this.router.navigate(['home/seguridad/administracion/usuarios']);         
      });
    }

  ngOnInit(): void {
    this.serviLoad.sumar.emit(1);
    this.rest.get('trabEmpresa', this.token , this.parms).subscribe(data => {
    this.empresa = data;
  });

 this.ins.controls['empId'].valueChanges.pipe(  
  debounceTime(200),
  distinctUntilChanged()).subscribe(field => {
    this.ins.controls['empName'].setValue('');
    this.serviLoad.sumar.emit(2);
    this.parms        = [ {key: 'empId' , value: this.ins.controls['empId'].value}];
    this.rest.get('trabRolesAdm', this.token , this.parms).subscribe(data => {
        this.roles = data;
    });
    this.rest.get('trabGerenciaAdm', this.token , this.parms).subscribe(data => {
      this.gerencia = data;
    });

  });

  this.ins.controls['empName'].valueChanges.pipe(
    filter(text => text.length > 3),
    debounceTime(200),
    distinctUntilChanged()).subscribe(field => {
      this.validaNombre(field);
    });
  }
  public validaNombre(name : string){
    this.parms        = [{key :'emploName' ,value: name.trim()} , {key: 'empId' , value: this.ins.controls['empId'].value}];
    this.rest.get('valUsuarioAdm' , this.token , this.parms).subscribe((cant : any)=>{
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
