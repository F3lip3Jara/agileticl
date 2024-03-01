import { LoadingService } from './../servicios/loading.service';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {throwError,catchError, tap} from 'rxjs';

import { AlertasService } from '../servicios/alertas.service';
import { Router } from '@angular/router';

export interface MensajesSystem{
    url    :string ,
    mensaje:string,
    type   :string
}

@Injectable({
  providedIn: 'root'
})
export class InterceptorsErrorService implements HttpInterceptor  {


//private servidor: string = 'http://app.back.agileti.cl/';
private servidor: string = 'http://127.0.0.1:8000/';



  constructor(private servicio : AlertasService , private serLoad : LoadingService ,    private router : Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler ,  ): Observable<HttpEvent<any>> {


    const cloneReq= req.clone({url:  this.servidor + req.url});

    return next.handle(cloneReq).pipe(
    
      tap((event : HttpEvent<any>) => {
          if (event.type === HttpEventType.DownloadProgress) {
           // console.log("download progress");
            this.serLoad.restar.emit(1);
         }else{
          if (event.type === HttpEventType.Response) {
          // console.log("donwload completed");
            this.serLoad.restar.emit(1);
          }
         }

        if (event instanceof HttpResponse ) {

          switch(event.status){
            case  200 :{
              try {
                let array : any =  event.body;
                array.forEach((celement: any) => {                  
                  if(celement.mensaje.length > 0){                                        
                    this.servicio.setAlert(celement.mensaje,celement.type)
                  }
               });
              }catch(e){

              }
             break;
            }
            case  203 :{
              this.servicio.setAlert('No posee privilegios','warning');
              break;
          }
          case  204 :{
            this.servicio.setAlert('Registro posiblemente no encontrado','warning');
            break;
          }
         
          }
        }
      }),
        catchError(error => {
          let errorMessage = '';
          if (error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error en el cliente (interceptor): ${error.error.message}`;
          } else {
            switch(error.status){
                case  406 :{
                  this.servicio.setAlert('No se encuentra información', 'danger');
                  break;
                }
                case 403:{
                                  this.router.navigate(['home/seguridad/noautorizado']);
                }

            }
          }
          return throwError(errorMessage);
        })
    );
  }
}
