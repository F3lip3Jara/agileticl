import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import {Environment} from '../model/env.model';


@Injectable({
  providedIn: 'root'
})

export class WebSocketService {

 private environment = new Environment();
 private echo: Echo;
 
  constructor( ) {
        this.echo = new Echo ({
            broadcaster       : 'pusher',
            cluster           : this.environment.cluster ,
            key               : this.environment.key,
            wsHost            : this.environment.wsHost,
            wsPort            : this.environment.wsPort,
            wssHost           : this.environment.wsHost,
            wssPort           : this.environment.wsPort,
            forceTLS          : false,
            disableStats      : true,
            enabledTransports : ['ws','wss']
      });

   }

   startListening() { 
    this.echo.connector.options.debug = true; 
    this.echo.channel('channel-message').listen('MensajeEvent', (resp:any)=>{
      console.log(resp);
  });
  }

  close(){
    this.echo.disconnect();
    console.log('Disconnected from channel-message');
  }

  connect(){
    this.echo.connect();

  
  }
   
}
