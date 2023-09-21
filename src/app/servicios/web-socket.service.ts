import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
 public echo : Echo ;

  constructor() {
 this.echo = new Echo ({
      broadcaster: 'pusher',
      cluster: environment.cluster,
      key: environment.key,
      wsHost: environment.wsHost,
      wsPort: environment.wsPort,
      forceTLS: environment.forceTLS,
      disableStats: environment.disableStats,
      enabledTransports: ['ws']
  
    });
   }

   startListening() {

  this.echo.channel('channel-message').listen('MensajeEvent', (resp:any)=>{
    console.log(resp.tipo);
  });
  
    
  }

   
}
