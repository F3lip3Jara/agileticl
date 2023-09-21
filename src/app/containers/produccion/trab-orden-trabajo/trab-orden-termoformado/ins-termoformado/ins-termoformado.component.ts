import { TareasService } from './../../../../../servicios/tareas.service';
import { LoadingService } from './../../../../../servicios/loading.service';
import { AlertasService } from './../../../../../servicios/alertas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from './../../../../../servicios/rest.service';
import { LinksService } from './../../../../../servicios/links.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TermoDet } from 'src/app/model/termoDet.model';

@Component({
  selector: 'app-ins-termoformado',
  templateUrl:'./ins-termoformado.component.html',
  styleUrls: ['./ins-termoformado.component.css']
})
export class InsTermoformadoComponent implements OnInit {
  spinners                            = false;
  loading      : boolean              = true;
  carga        : string               = "invisible";
  insTerm      : FormGroup;
  extLotSal    : string               = '';
  insTermDet   : FormGroup;
  insCtl       : FormGroup;
  token        : string               = '';
  sacas        : any ;
  parametros   : any []               = [];
  producto     : any                  = {};
  val          : boolean              = false;
  fechaS       : string               = '';
  config       :any                   = {};
  maquinas     : any ;
  valGuar      : boolean              = false;
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
  pallet       : any                  = {};
  valCaja      : boolean              = false;
  textoControl : string               ='';
    
  constructor( private servicioLink : LinksService,
               private serviRest    : RestService,
               private servicio     : UsersService,
               private modal        : NgbModal,
               private fg           : FormBuilder,
               private servicioAlert: AlertasService,
               private serviLoad    : LoadingService,
               private serTareas    : TareasService

               ) {
                this.sacas         = {};
                this.insumos       = {};
                this.maquinas      = {};
                this.token         = this.servicio.getToken();
                this.orden_trabajo = this.serTareas.getExtrusion();

                this.insTerm= fg.group({
                  terMaq    : ['', Validators.compose([
                  Validators.required,
                  ])],
                  terTip : ['', Validators.compose([
                    Validators.required,
                    ])],
                  terPrdCaja : ['', Validators.compose([
                  
                      ])],
                  terPrdBolsa : ['', Validators.compose([
                        Validators.required,
                        ])],
                  terLotCaja : ['', Validators.compose([
                     
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
    this.serviLoad.sumar.emit(3);

    this.insTerm.controls['terTip'].valueChanges.subscribe(data => {
      if(data == 'B'){
        this.valCaja      = true;
        this.textoControl ='';        
      }else{
        this.valCaja      = false;
        this.insTerm.controls['terLotCaja'].setValue('');
        this.textoControl ='Debe ingresar el insumo de caja con su lote';        
      }
    });

    this.insTerm.controls['terLotCaja'].valueChanges.subscribe(data => { 
      let tipo =   this.insTerm.controls['terTip'].value;
      if(tipo == 'P'){
      if(data.length == 0){
        this.textoControl ='Debe ingresar el insumo de caja con su lote';       
        this.valCaja = false;
       
      }else{
        let prd  = this.insTerm.controls['terPrdCaja'].value;     
          if(prd > 0){
            this.textoControl ='';     
            this.valCaja = true;
          }else{
        
            this.valCaja = false;
          }
        
        }
      }else{
        this.valCaja      = true;
        this.textoControl ='';    
      }      
    });

    this.insTerm.controls['terPrdCaja'].valueChanges.subscribe(data => { 
      let tipo =   this.insTerm.controls['terTip'].value;
      if(tipo == 'P'){
      if(data == 0){
        this.textoControl ='Debe ingresar el insumo de caja con su lote';       
        this.valCaja = false;
       
      }else{
        let prd  = this.insTerm.controls['terLotCaja'].value;     
          if(prd.length > 0){
            this.textoControl ='';     
            this.valCaja = true;
          }else{
        
            this.valCaja = false;
          }
        
        }
      }else{
        this.valCaja      = true;
        this.textoControl ='';    
      }      
    });



  }

  insTermoformado(terMaq:any , terTip:any, terPrdCaja:any , terPrdBolsa:any ,terLotCaja:any ,  terLotBolsa:any, terTurn:any){
    this.serviLoad.sumar.emit(1);
    this.parametros  = [];
    this.parametros  = [{'idTer':this.orden_trabajo.id_termo, 'idOt': this.orden_trabajo.id , 'terMaq' : terMaq , 'terTip' : terTip , 'terPrdCaja' : terPrdCaja, 'terPrdBolsa': terPrdBolsa, 'terLotCaja': terLotCaja , 'terLotBolsa' : terLotBolsa , 'terTurn' : terTurn , 'terDia' : this.diaJul} ] ;
    this.serviRest.post('insTerm', this.token, this.parametros).subscribe(resp => {
      this.val = true;
      resp.forEach((elementx : any)  => {
      if(elementx.error == '0'){
          this.isEnabled  = true;
          console.log(elementx.data);
          let datos       = elementx.data;
          datos.forEach((element : any) => {
              console.log(element);
              this.terLotSal = element.terLotSal;
              this.idTer     = element.idTer;
          });
          setTimeout(()=> {
            this.val= false;
            this.valGuar = true;
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
    this.peso      = '';
    this.ancho     = '';
    this.espesor   = '';
    this.insTermDet.reset();
    this.extLotSal = '';
    let terTip     = this.insTerm.controls['terTip'].value;   
    
    let par : any = [{'id': this.idTer,  'terTip': terTip , 'prdCod': this.orden_trabajo.producto , 'terLotSal' : this.terLotSal , 'termoDet': termo  }];
    
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

  delPrd(index:any, termo:any){
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

  delPeso(index:any ){
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
    this.serviLoad.sumar.emit(1);   
    let par : any = [{'id': this.idTer , 'termoDet' : termo }];
    this.serviRest.post('termPallet', this.token, par).subscribe(resp => {
      this.pallet = resp;
       
    });
      this.modal.open(content);
  }

  selProducto (event : any){
    this.insTerm.controls['terPrdCaja'].setValue(event.idPrd);       
  }

  selProducto2 (event : any){
    this.insTerm.controls['terPrdBolsa'].setValue(event.idPrd);
    
  }


}
