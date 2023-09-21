
import { Component } from '@angular/core';
import { Alert } from 'src/app/model/alert.model';
import { AlertasService } from 'src/app/servicios/alertas.service';


@Component({
  selector: 'app-alert',
 
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
  

})
export class AlertComponent {
  position   = 'top-end';
  visible    = false;
  percentage = 0;
  show       = false;
  type     : string  = '';
  alerta   : Alert   ;

 

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 50;
  }

  constructor( private  servicio : AlertasService){

    this.alerta = this.servicio.getAlert();
  
    
  }


  ngOnInit() {
    this.servicio.disparador.subscribe(data=>{   
      //  this.alerta  = data;
        this.show    = true; 
        this.visible = !this.visible;      
    
   });
  }
}
