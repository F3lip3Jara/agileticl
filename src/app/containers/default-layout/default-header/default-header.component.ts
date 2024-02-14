import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { faIndustry} from '@fortawesome/free-solid-svg-icons';
import Echo from 'laravel-echo';
import { webSocket , WebSocketSubject } from 'rxjs/webSocket';
import { WebSocketService } from 'src/app/servicios/web-socket.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";


  public usuario    : string  = '';
  public rol        : string  = '';
  public imgName    : string  = '';
  public idRol      : number  = 0;
  public token       : string ='';
  public parametros : any[]   = []; 
  public datos      : any;
  public contador   : any;
  public socket      : any;
  faIndustry                  = faIndustry;

  constructor(private classToggler: ClassToggleService, 
               private rest        : RestService ,
               private servicioUser:  UsersService,
               private servicioAler: AlertasService,
               private router      : Router,
               private webSocketService : WebSocketService 
              
              ) {
    super();
    this.token = this.servicioUser.getToken();

   
  }


  ngOnInit(): void {
 /* 
  this.rest.get('getUsuario' , this.token, this.parametros).subscribe(respuesta  => {
     let usuariox = respuesta;    

     Object.values(respuesta).forEach(element=>{
        this.usuario  = element.name;
        this.rol      = element.rolDes;
        this.imgName  = element.imgName;

      });

      if(this.usuario == ''){
           this.router.navigate(['/login']);
           this.servicioAler.setAlert('','');
           this.servicioUser.eliminarToken();
        }

      if(this.imgName == null){
    
      }


    });*/


    this.rest.get('notificaciones' , this.token, this.parametros).subscribe((data:any)=>{      
      this.datos    = data.notificaciones;
      this.contador = data.contador;   
      
    });
    
    this.webSocketService.startListening();



  }


  websockets(){
   // window['Pusher'] = Pusher;
 
    /*const echo = new Echo ({
      broadcaster: 'pusher',
      cluster: 'mt1',
      key: 'ASD1323',
      wsHost: '127.0.0.1',
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws']

    });

    echo.connector.options.debug = true;  
    setInterval(()=>{

   /* echo.channel('channel-message').listen('1', (resp: any) => {
      const data = JSON.parse(resp.data);
      console.log('mensaje2');
  });
  echo.channel('channel-message').subscribed((resp : any)=> {
    console.log(resp);
    
  });
  

  },2000);

  

  

// Escuchar mensajes
const socket: WebSocketSubject<any> = webSocket('ws://127.0.0.1:6001/app/ASD1323?protocol=7&client=js&version=8.3.0&flash=false');
setInterval(()=>{


socket.subscribe(
  ()=>{
    console.log('mensaje');
    
  }

);},2000);
*/



  
  }



  salir(){
    this.router.navigate(['/login']);
    this.servicioAler.setAlert('','');
    this.servicioUser.eliminarToken();
  }

  lectura(datos: any){
    this.rest.post('lecturaNot' , this.token, datos).subscribe(data =>{
    });
}

verNotificaciones(){

  this.rest.post('lecturaNotAll' , this.token, this.datos).subscribe(data =>{
    console.log(data)
  });

  this.rest.get('notificaciones' , this.token, this.parametros).subscribe((data:any)=>{      
    this.datos    = data.notificaciones;
    this.contador = data.contador;       
  });

  this.router.navigate(['home/seguridad/notificaciones']);

}


}
