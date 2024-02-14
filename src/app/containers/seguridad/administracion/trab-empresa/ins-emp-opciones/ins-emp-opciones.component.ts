import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowTurnDown, faArrowUp, faStar } from '@fortawesome/free-solid-svg-icons';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { AlertasService } from 'src/app/servicios/alertas.service';

@Component({
  selector: 'app-ins-emp-opciones',
  templateUrl: './ins-emp-opciones.component.html',
  styleUrls: ['./ins-emp-opciones.component.scss']
})
export class InsEmpOpcionesComponent {

  token           : string  = '';
  parametros      : any     = [];
  val             : boolean = false;
  valRut          : boolean = false;
  mensaje         : string  = '';
  faArrowTurnDown           = faArrowTurnDown;
  empresa         :any      = {};
  optAsig         :any    = [];
  optnAsig        :any    = [];
  faStar                    = faStar;
  faArrowUp                 = faArrowUp;

  constructor( private servicio     : UsersService,
               private rest         : RestService,
               private excel        : ExcelService,             
               private serviLoad    : LoadingService,
               private router       : Router,
               private route        : ActivatedRoute,
               private servicioalert: AlertasService){
  
                this.token = this.servicio.getToken();
               
                
              }

  ngOnInit(){
    this.route.params.subscribe(params => {
      const empresaString = params['empresa'];
      this.empresa = JSON.parse(empresaString);
    });

    this.parametros = [{key: 'empId' , value:this.empresa.empId}]
    this.rest.get('optsnAsig', this.token,this.parametros).subscribe(data => {
      this.optnAsig = data;
   
      
    });
    
    this.rest.get('optAsig', this.token,this.parametros).subscribe(data => {
      this.optAsig = data;
    });

  }

 

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  guardar(){
    this.parametros            = {empId: this.empresa.empId , asig:this.optAsig};
    this.val                   = true;
    this.serviLoad.sumar.emit(1);
    this.rest.post('insEmpOpt', this.token, this.parametros).subscribe(resp => {
        this.val = false;
    });
    this.servicioalert.disparador.emit();
  }
}