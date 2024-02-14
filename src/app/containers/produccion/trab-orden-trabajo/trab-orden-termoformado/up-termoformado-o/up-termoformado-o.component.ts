import { Component, OnInit } from '@angular/core';
import { TareasService } from './../../../../../servicios/tareas.service';
import { LoadingService } from './../../../../../servicios/loading.service';
import { AlertasService } from './../../../../../servicios/alertas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from './../../../../../servicios/rest.service';
import { LinksService } from './../../../../../servicios/links.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TermoDet } from 'src/app/model/termoDet.model';


@Component({
  selector: 'app-up-termoformado-o',
  templateUrl: './up-termoformado-o.component.html',
  styleUrls: ['./up-termoformado-o.component.css']
})
export class UpTermoformadoOComponent implements OnInit {
  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible";
  insTerm      : FormGroup;
  insCtl       : FormGroup;
  extLotSal    : string               = '';
  insTermDet   : FormGroup;
  token        : string               = '';
  sacas        : any ;
  parametros   : any []               = [];
  producto     : any                  = {};
  val          : boolean              = false;
  fechaS       : string               = '';
  config       :any                   = {};
  maquinas     : any ;
  valGuar      : boolean              = true;
  diaJul       : any;
  isEnabled    : boolean              = false;
  terLotSal    : string               = '';
  idTer        : number               = 0;
  valJul       : boolean              = false;
  etapas       : any                  = {};
  today        : Date                 = new Date();
  pipe                                = new DatePipe('en-US');
  todayWithPipe: any;
  insumos      : any;
  orden_trabajo: any;
  peso         : string               = '';
  ancho        : string               = '';
  espesor      : string               = '';
  termoDet     : any[]                = [];
  termoPeso    : any[]                = [];
  termoformado : any                  = {};
  terTip       :string                = '';
  pallet       : any                  = {};
  
    
    
  constructor( private servicioLink : LinksService,
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
                this.terLotSal     = this.orden_trabajo.lote_salida;
                console.log(this.orden_trabajo);

                this.insTerm= fg.group({
                  terMaq    : ['', Validators.compose([
                  Validators.required,
                  ])],
                  terTip : ['', Validators.compose([
                    Validators.required,
                    ])],
                  terPrdCaja : ['', Validators.compose([
                      Validators.required,
                      ])],
                  terPrdBolsa : ['', Validators.compose([
                        Validators.required,
                        ])],
                  terLotCaja : ['', Validators.compose([
                        Validators.required,
                        ])],
                  terLotBolsa : ['', Validators.compose([
                          Validators.required,
                  ])],
                  terTurn: ['', Validators.compose([
                    Validators.required,
                   ])],
                });

                this.insTermDet= fg.group({ 
                  terdHorIni    : ['', Validators.compose([
                  Validators.required,
                  ])],
                  terdTem    : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                    ])],
                  terdPesoUn    : ['', Validators.compose([
                      Validators.required,
                      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                  ])],
                  terdCaja    : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                   ])],
                });

                this.insCtl = fg.group({
                  terCavTot    : ['', Validators.compose([
                  Validators.required,
                  Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                  ])],
                  terRepro    : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                  ])],
                  terCavAct    : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                  ])],
                  terMerma    : ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'),
                  ])]
                });
   }

  ngOnInit(): void {
    this.serviRest.get('diaJul', this.token , this.parametros).subscribe(data => {
      this.diaJul = data;
        if(this.diaJul =='0'){
          this.valJul = true;
        }else{
          this.loading = false;
          this.carga   = 'visible';
        }     
    });

    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd-MM-yyyy');

    this.parametros = [{key:'idEta' , value : 5}];

    this.serviRest.get('filEta', this.token , this.parametros).subscribe(data => {
      this.maquinas = data;
    });

    this.serviRest.get('prodInsumo', this.token , this.parametros).subscribe(data => {
      this.insumos = data;
    });        

    this.parametros = [{key:'terLotSal' , value : this.terLotSal}];
    
    this.serviRest.get('termoformado', this.token , this.parametros).subscribe((data:any) => {     
      this.termoformado = data.termoformado;
      console.log(this.termoformado);
      this.termoformado.forEach((element: any) => {
        this.idTer     = element.idTer;
        this.terTip    =element.terTip;
        this.insCtl.controls['terCavTot'].setValue(element.terCavTot);
        this.insCtl.controls['terCavAct'].setValue(element.terCavAct);
        this.insCtl.controls['terRepro'].setValue(element.terRepro);
        this.insCtl.controls['terMerma'].setValue(element.terMerma);       
      });

      data.termoPeso.forEach((element :any) => {
        let pesos = {'terpPeso' : element.terpPeso,'terptip' : element.terptip};
        this.termoPeso.push(pesos);
      });
      data.termoDet.forEach((element:any)=>{
        let termo = new TermoDet(this.idTer, element.terdEst, element.terdHorIni,'',element.terdLotExt, element.peso , element.ancho , element.espesor, element.terdTem , element.terdPesoUn , element.terdCaja ,element.terdTipo);
        this.termoDet.push(termo);
      })
    });

    this.serviLoad.sumar.emit(4);
  }


  volver(){
    const d = 'Ot_Ter';
    this.servicioLink.disparador.emit(d);
    return false;
  }

  insCtlProd(modalInsCtl : any){
    this.modal.open(modalInsCtl , {size:'lg'});
    this.peso      = '';
    this.ancho     = '';
    this.espesor   = '';
    this.extLotSal = '';
  }

  selExtrusion(extrusion : any){     
    this.peso      = extrusion.extKilApr;
    this.ancho     = extrusion.extAnbob ;
    this.espesor  = extrusion.extFor;
    this.extLotSal = extrusion.extLotSal;
  }

  insTermDetalle(terdHorInix : any ,terdTem:number , terdCaja : number ,  terdPesoUn:number){
    let horaI      = terdHorInix.hour; 
     let minI      = terdHorInix.minute; 
  
      if(terdHorInix.hour < 10){
        horaI = '0' + terdHorInix.hour
      }
      if(terdHorInix.minute  < 10){
        minI = '0' + terdHorInix.minute;
      }   
      let terdHorIni =  horaI + ':' + minI;  
  
      let termo = new TermoDet(this.idTer, 'P', terdHorIni,'',this.extLotSal, this.peso , this.ancho , this.espesor, terdTem , terdPesoUn , terdCaja , 'O');
      this.termoDet.push(termo);
      this.modal.dismissAll();    
      this.peso    = '';
      this.ancho   = '';
      this.espesor = '';
      this.insTermDet.reset();
      this.extLotSal = '';
      let terTip = this.terTip;

      let par : any = [{'id': this.idTer, 'termoDet': termo , 'terTip': terTip , 'prdCod': this.orden_trabajo.producto , 'terLotSal' : this.terLotSal }];
      
      this.serviRest.post('insTermDet', this.token, par).subscribe(resp => {
        resp.forEach((elementx : any)  => {
          if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> {           
              this.modal.dismissAll();       
              },1000 );
          }
            
         });
      });
      this.servicioAlert.disparador.emit(this.servicioAlert.getAlert()); 
    }

  delPrd(index:any , termo:any){
    this.termoDet.splice(index , 1);
    let par : any = [{'id': this.idTer, 'termoDet': termo}];    
    this.serviRest.post('delTermDes', this.token, par).subscribe(resp => {
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> {                 
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

  insCtlPeso(content : any){
    this.modal.open(content);
  }

  insPesos(terpPeso : any){
    let pesos = {'terpPeso' : terpPeso,'terptip' : 'O'};
    this.termoPeso.push(pesos);
  }

  delPeso(index:any){
    this.termoPeso.splice(index , 1);
  }


  terminar(content : any){  
     this.modal.open(content , {size:'lg'});
  }


  insTermCierre(terCavTot:any, terCavAct:any,terRepro:any,terMerma:any ){
    this.val      = true;
    this.serviLoad.sumar.emit(1);   
    let par : any = [{'id': this.idTer, 'terCavTot' : terCavTot , 'terCavAct' : terCavAct , 'terMerma': terMerma  ,'terRepro': terRepro, 'termoPeso' : this.termoPeso,'termoDet': this.termoDet}];
    
    this.serviRest.post('insTermCierre', this.token, par).subscribe(resp => {
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            this.isEnabled  = true;       
            setTimeout(()=> {
              const d = 'Ot_Ter';
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

  public  verTermoPallet(content:any , termo:any) {
    let par : any = [{'id': this.idTer , 'termoDet' : termo }];
    this.serviRest.post('termPallet', this.token, par).subscribe(resp => {
      this.pallet = resp;
       
    });
    this.modal.open(content);
}

  
}
