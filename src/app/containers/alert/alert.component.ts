
import { Component } from '@angular/core';
import { Alert } from 'src/app/model/alert.model';
import { AlertasService } from 'src/app/servicios/alertas.service';


@Component({
  selector: 'app-alert',
 
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
  

})
export class AlertComponent {
  position           = 'top-end';
  visible            = false;
  percentage         = 0;
  show               = false;
  type     : string  = '';
  alerta   : Alert   ;
  mensaje  : string  = '';
 

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
   
      
      setTimeout(()=> {
        this.show    = true; 
        this.mensaje = '';        
        this.visible = !this.visible;  
        this.mensaje = this.alerta.getMessage();    
        if(this.alerta.getType() == 'success'){
          const audio = new Audio('assets/notificacion.mp3');
          audio.play();
        }

        if(this.alerta.getType() == 'danger'){
          const audio = new Audio('assets/error.mp3');
          audio.play();
        }

     },1500 );
      
    
   });
  }
}
