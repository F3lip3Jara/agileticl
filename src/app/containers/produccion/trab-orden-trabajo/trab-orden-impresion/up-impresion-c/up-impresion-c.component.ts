import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { LinksService } from 'src/app/servicios/links.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { TareasService } from 'src/app/servicios/tareas.service';
import { UsersService } from 'src/app/servicios/users.service';

@Component({
  selector: 'app-up-impresion-c',
  templateUrl: './up-impresion-c.component.html',
  styleUrls: ['./up-impresion-c.component.css']
})
export class UpImpresionCComponent implements OnInit {

  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible"; 
  //insCtl       : FormGroup;
  insImpDet    : FormGroup;
  impLotSal    : string               = '';
  token        : string               = '';
  sacas        : any ;
  parametros   : any []               = [];
  insDetO       : any []               = [];
  producto     : any                  = {};
  val          : boolean              = false;
  fechaS       : string               = '';
  config       :any                   = {};
  maquinas     : any ;
  valGuar      : boolean              = true;
  diaJul       : any;
  isEnabled    : boolean              = false;
  idImp        : number               = 0;
  valJul       : boolean              = false;
  etapas       : any                  = {};
  today        : Date                 = new Date();
  pipe                                = new DatePipe('en-US');
  todayWithPipe: any;
  insumos      : any;
  orden_trabajo: any;
  impDet       : any[]                = [];  
  impresion    : any                  = {};
  terTip       :string                = '';
  pallet       : any                  = {};
  extLotSal    : string               = '';
  rechazo      : any                  = {};
  myReader     : FileReader                 = new FileReader();
  nombreArch   : string               = '';  
  imprePeso    : any[]                = [];
  impTinta     : any[]                = [];
    
    
constructor(   private servicioLink : LinksService,
               private serviRest    : RestService,
               private servicio     : UsersService,
               private modal        : NgbModal,
               private fg           : FormBuilder,
               private servicioAlert: AlertasService,
               private serviLoad    : LoadingService,
               private serTareas    : TareasService) {
                this.sacas         = {};
                this.insumos       = {};
                this.maquinas      = {};
                this.token         = this.servicio.getToken();
                this.orden_trabajo = this.serTareas.getExtrusion();
                this.impLotSal     = this.orden_trabajo.lote_salida;

                this.insImpDet= fg.group({ 
                  impdHorIni    : ['', Validators.compose([
                  Validators.required,
                  ])],
                 
                  impdPesoCaja    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                  ])],
                  impdCajaAcu     : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                   ])],
                   impdDefecto: ['', Validators.compose([
                    Validators.required                    
                   ])],
                });
                
   }

  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd-MM-yyyy');
    this.parametros = [{key:'idEta' , value : 8}];

    this.serviRest.get('filEta', this.token , this.parametros).subscribe(data => {
      this.maquinas = data;
    });

    this.serviRest.get('prodInsumo', this.token , this.parametros).subscribe(data => {
      this.insumos = data;
    });
        
    let etapas      = [8];   
    this.parametros = [{"key": "etapas" , "value" :etapas}];  
    this.serviRest.get('motEta', this.token , this.parametros).subscribe(data =>{
      this.rechazo = data;
    });
  
    this.parametros = [{"key": "impLotSal" , "value" :this.impLotSal}];  
    this.serviRest.get('impresion', this.token , this.parametros).subscribe((data:any) => {     
      this.impresion = data.impresion;
      this.impDet    = data.impresionDet;
      this.impTinta  = data.impTinta;
      this.imprePeso = data.impPeso;

      this.impresion.forEach((element: any) => {
        this.idImp     = element.idImp;
      
        if(this.idImp > 0){
          this.carga    = 'visible';
          this.loading  = false;
          this.val      = false;
        }
      });
    });

    this.serviLoad.sumar.emit(4);
  }

  volver(){
    const d = 'impresion';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  terminar(content : any){  
     this.modal.open(content , {size:'lg'});
  }

 insTermCierre(){
    this.val      = true;
    this.serviLoad.sumar.emit(1);   
    let par : any = [{'id': this.idImp,  'impPeso' : this.imprePeso}];
    this.serviRest.post('insImpCierreC', this.token, par).subscribe(resp => {
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> {
              const d = 'impresion';
              this.servicioLink.disparador.emit(d);    
              this.modal.dismissAll();       
              },1000 );
          }else{
            this.carga    = 'visible';
            this.loading  = false;
            this.val      = false;
          }
       });
    });
    this.servicioAlert.disparador.emit(this.servicioAlert.getAlert()); 
  }

  insPesos(impPeso : any){
    let pesos = {'impPeso' : impPeso,'imppTip' : 'C'};
    this.imprePeso.push(pesos);
  }

  delPeso(index:any ){
    this.imprePeso.splice(index , 1);
    
  }

  


}
