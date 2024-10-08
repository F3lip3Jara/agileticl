import { Injectable, Output ,EventEmitter} from '@angular/core';
import { Alert } from '../model/alert.model';


@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  @Output() disparador  :EventEmitter <Alert> = new EventEmitter();
  @Output() loading     :EventEmitter <any>  = new EventEmitter();

  alerta : Alert = new Alert('', '');

  getAlert(): Alert {
     return this.alerta;
  }

  setAlert(mensaje : string  , type : string){
    this.alerta = new Alert(mensaje, type);
    this.disparador.emit(this.alerta);
  }
  
  constructor(){

  }

}
