import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { faIndustry, faMagnifyingGlass, faMoneyBillTransfer} from '@fortawesome/free-solid-svg-icons';
import { WebSocketService } from 'src/app/servicios/web-socket.service';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, filter, map, merge, switchMap, tap } from 'rxjs';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  public usuario    : any     = {};
  public rol        : string  = '';
  public avatar    : string  = '';
  public idRol      : number  = 0;
  public token      : string  = '';
  public parametros : any[]   = []; 
  public datos      : any;
  public contador   : any;
  public socket     : any;

  faIndustry                          = faIndustry;
  indicadores       :any              = {};
  faMoneyBillTransfer                 = faMoneyBillTransfer;
  val                                 = true;
  faMagnifyingGlass                   = faMagnifyingGlass;


  @ViewChild('instance', {static: true}) instance?: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  states       : string[]             = []; 
  statesx      : any[]                = [];
  model        : string               = '';
  
   constructor(private classToggler     : ClassToggleService, 
               private rest             : RestService ,
               private servicioUser     : UsersService,
               private servicioAler     : AlertasService,
               private router           : Router,
               private websocket        : WebSocketService 
              
              ) {
    super();
    this.token   = this.servicioUser.getToken();
    this.usuario = this.servicioUser.getUser();
    this.avatar = this.usuario.img;
    
   
    this.usuario.menu.forEach((element:any) => {
  
      element.opciones.forEach((opcion:any) => {       
        if(opcion.optSub == 'S'){
          opcion.childrens.forEach((element:any) => {
            this.states.push(element.name);
            this.statesx.push({optDes : element.name, optLink : element.url})
          });        
        }else{
          this.states.push(opcion.optDes);
          this.statesx.push({optDes : opcion.optDes, optLink : opcion.optLink})
        }       
      });
      
    });

    if(this.avatar == ''){
     this.avatar = this.usuario.usuario.substring(0,2);
    } 
   
  }


  ngOnInit(): void {
    this.rest.get('indicadores' , this.token, this.parametros).subscribe((data:any)=>{      
      this.indicadores = data;
      if(data.length > 0){
        this.val = true;
      } 
    });    
      this.servicioUser.disparador.subscribe(next =>{
            this.avatar = next;
          
      });
  }

  salir(){
    this.websocket.close();
    this.servicioAler.setAlert('','');
    this.servicioUser.eliminarToken();
    this.router.navigate(['/login']);

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

  
search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
  const debouncedText$         = text$.pipe(debounceTime(200), distinctUntilChanged());
  const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
  const inputFocus$ = this.focus$;
  return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      tap(term => { 
          this.statesx.forEach(element => {
              if(element.optDes == term){                 
                this.router.navigate(['home/'+ element.optLink]);
                this.model = '';
              } 
          });          
      }),
      map(term => {
          if (term.length >= 2) {
              return term === '' ? this.states : this.states.filter((v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
          } else {
              return [];
          }
      })
  );
};

onSelect(item: any) {
this.statesx.forEach(element => {
  if(element.optDes == item.item){                 
    this.router.navigate(['home/'+ element.optLink]);
    this.model = '';
  }
});      
}

ajustes(){
  let parm : any[] =[];
  this.rest.get('getUsuario', this.token , parm).subscribe((data:any) => {
    data.forEach((element:any) => {
      const dato = JSON.stringify(element); 
        this.router.navigate(['home/seguridad/ajustes/' + dato]);        
      });
  });
}

}
