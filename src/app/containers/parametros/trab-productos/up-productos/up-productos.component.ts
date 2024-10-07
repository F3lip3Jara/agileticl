import { LoadingService } from './../../../../servicios/loading.service';
import { RestService } from './../../../../servicios/rest.service';
import { UsersService } from './../../../../servicios/users.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Producto } from 'src/app/model/producto.model';
import { LogSys } from 'src/app/model/logSys.model';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { faCalendarWeek, faArrowTurnDown, faGears, faCartFlatbed, faTruckMoving, faTableColumns} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-up-productos',
  templateUrl: './up-productos.component.html',
  styleUrls: ['./up-productos.component.css']
})
export class UpProductosComponent implements OnInit {

 
  ins          : FormGroup;
  loading      : boolean              = true;
  medidas      :any;
  monedas      :any;
  grupos       :any;
  subgrupos    :any;
  colores      :any;
  carga        : string               = "invisible";
  val          : boolean              = false;
  token        : string               = '';
  parametros   : any []               = [];
  valCod       : any;
  valEan       : any;
  mensaje      : string               = '';
  faArrowTurnDown                     = faArrowTurnDown;
  faGears                             = faGears;
  faCartFlatbed                       = faCartFlatbed;
  faTruckMoving                       = faTruckMoving;
  faTableColumns                      = faTableColumns;
  active = 1;
  prdId                                = 0;
  prdCod                               ='';
  prdEan                               = '';

  constructor(private fg          : FormBuilder,
              private servicio    : UsersService,
              private rest        : RestService,
              private serviLoad   : LoadingService,
              private serLog      : LogSysService,
              private router       : Router,
              private route        : ActivatedRoute
              ) {

      this.medidas       = {};
      this.monedas       = {};
      this.grupos        = {};
      this.subgrupos     = {};
      this.colores       = {};

      this.token     = this.servicio.getToken();
      this.medidas       = {};
      this.monedas       = {};
      this.grupos        = {};
      this.subgrupos     = {};
      this.colores       = {};

      this.token     = this.servicio.getToken();

      this.ins = fg.group({
        prdCod : ['', Validators.compose([
        
          ])],
          prdInv : ['', Validators.compose([
            ])],

          prdDes : ['', Validators.compose([
            Validators.required
            ])],

          prdObs : ['', Validators.compose([
           ])],

           prdEan : ['', Validators.compose([
           
            ])],

            unId : ['', Validators.compose([
              Validators.required
            ])],

            grpId : ['', Validators.compose([
              Validators.required
            ])],

            grpsId : ['', Validators.compose([
              Validators.required
            ])],

            prdTip : ['', Validators.compose([
              Validators.required
            ])],

            colId : ['', Validators.compose([
              Validators.required
            ])],

            monId : ['', Validators.compose([
              Validators.required
            ])],

            prdCost : ['', Validators.compose([
              Validators.required ,
              Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')
            ])],

            prdNet : ['', Validators.compose([
              Validators.required,
              Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')
            ])],

            prdBrut : ['', Validators.compose([
              Validators.required,
              Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')
            ])],

            prdPes : ['', Validators.compose([
              Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')
            ])],

            prdMin : ['', Validators.compose([
              Validators.required,
              Validators.pattern('^-?[0-9]\\d*?$')
            ])],
      });
    }


  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const obj = params['id'];
      this.prdId = JSON.parse(obj);
    });

  this.parametros = [{key :'prdId' ,value: this.prdId}];
  this.rest.get('datPrd' , this.token, this.parametros).subscribe((data:any) => {

  data.forEach((element:any) => {
      
    this.ins.controls['prdDes'].setValue(element.prdDes);
    this.ins.controls['prdObs'].setValue(element.prdObs);
    this.ins.controls['prdEan'].setValue(element.prdEan);
    this.ins.controls['unId'].setValue(element.unId);
    this.ins.controls['grpId'].setValue(element.grpId);
    this.ins.controls['grpsId'].setValue(element.grpsId);
    this.ins.controls['prdTip'].setValue(element.prdTip);
    this.ins.controls['colId'].setValue(element.colId);
    this.ins.controls['monId'].setValue(element.monId);
    this.ins.controls['prdCost'].setValue(element.prdCost);
    this.ins.controls['prdNet'].setValue(element.prdNet);
    this.ins.controls['prdBrut'].setValue(element.prdBrut);
    this.ins.controls['prdPes'].setValue(element.prdPes);
    this.ins.controls['prdMin'].setValue(element.prdMin);
    this.ins.controls['prdCod'].setValue(element.prdCod);
    this.prdCod = element.prdCod;
    this.prdEan = element.prdEan;
  });
  
    
  })


    this.rest.get('trabUnidad' , this.token,this.parametros).subscribe(data => {
          this.medidas = data;
    });

    this.rest.get('trabGrupo' , this.token,this.parametros).subscribe(data => {
        this.grupos = data;
    });

    this.rest.get('trabColor' , this.token,this.parametros).subscribe(data => {
      this.colores = data;
    });

    this.rest.get('trabMoneda' , this.token,this.parametros).subscribe(data => {
      this.monedas = data;
      this.loading =  false;
      this.carga = 'visible';
    });

    this.ins.controls['grpId'].valueChanges.subscribe(field => {
    this.subgrupos = {};
    this.parametros = [{key :'grpId' ,value: field}];
    this.rest.get('subGrp' , this.token, this.parametros).subscribe(data => {
      this.subgrupos = data;
      });
    });

  
   
    this.serviLoad.sumar.emit(4);

  }

  public guardar(
    prdDes: string,
    prdCod: string,
    prdObs: string,
    prdEan: number,
    prdTip: string,
    prdCost: any,
    prdNet: any,
    prdBrut: any,
    prdInv: any,
    prdPes: number,
    prdMin: number,
    idGrp: number,
    idSubGrp: number,
    idCol: number,
    idMon: number,
    idUn : number){


   if(prdInv == true){
        prdInv = 'S';
    }else{
        prdInv = 'N';
    }

    let producto : Producto  = new Producto(0, prdDes , prdCod , prdObs, '', prdEan , prdTip , prdCost , prdNet , prdBrut , prdInv , prdPes , prdMin , idGrp , idSubGrp , idCol , idMon , idUn )
    this.val                 = true;
    this.serviLoad.sumar.emit(1);
    this.rest.post('updProducto', this.token, producto).subscribe(resp => {
      this.router.navigate(['home/parametros/productos']);
    });
  }


}
