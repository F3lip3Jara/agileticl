import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowTurnDown, faArrowUp, faStar ,faGear} from '@fortawesome/free-solid-svg-icons';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-ins-emp-opciones',
  templateUrl: './ins-emp-opciones.component.html',
  styleUrls: ['./ins-emp-opciones.component.scss']
})
export class InsEmpOpcionesComponent {
  isLoading       : boolean = true;
  token           : string  = '';
  parametros      : any     = [];
  val             : boolean = false;
  valRut          : boolean = false;
  mensaje         : string  = '';
  faArrowTurnDown           = faArrowTurnDown;
  empresa         :any      = {};
  optAsig         :any      = [];
  optnAsig        :any      = [];
  faStar                    = faStar;
  faArrowUp                 = faArrowUp;
  faGear                    = faGear;
  loading      : boolean    = true;
  carga        : string     = "invisible";

  constructor( private servicio     : UsersService,
               private rest         : RestService,
               private excel        : ExcelService,             
               private serviLoad    : LoadingService,
               private router       : Router,
               private route        : ActivatedRoute,
               ){
  
                this.token = this.servicio.getToken();
               
                
              }

  ngOnInit(){
    this.serviLoad.sumar.emit(2);

    this.route.params.subscribe(params => {
      let empId = params['empresa'];
      this.parametros = [{key : 'empId', value:empId}];  
      this.rest.get('empresafil', this.token, this.parametros).subscribe((resp:any) => {
          resp.forEach((element:any) => {

            this.empresa = element;          
            this.parametros = [{key: 'empId' , value:this.empresa.empId}]
            this.rest.get('optsnAsig', this.token,this.parametros).subscribe(data => {
              this.optnAsig = data;
            });
            
            this.rest.get('optAsig', this.token,this.parametros).subscribe(data => {
              this.optAsig = data;
            });

            setTimeout(()=> {
              this.carga = 'visible';
              this.loading = false;
           },1500 );
          });
      });
    });

  }

  guardar(){
    this.parametros            = {empId: this.empresa.empId , asig:this.optAsig};
    this.val                   = true;
    this.serviLoad.sumar.emit(1);
    this.rest.post('insEmpOpt', this.token, this.parametros).subscribe(resp => {
        this.val = false;
    });
  
  }
}
