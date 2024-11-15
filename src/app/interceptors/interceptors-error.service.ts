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


//private servidor: string = 'https://app.back.agileti.cl/';
private servidor: string = 'http://127.0.0.1:8000/';
//private servidor: string = 'https://app.back.qa.agileti.cl/';
private excludedUrl  : any [] = [
  {url : 'https://www.googleapis.com/books/v1/volumes?maxResults=5&orderBy=relevance&q=oliver%20sacks'}

]; 

constructor(private servicio : AlertasService , private serLoad : LoadingService ,    private router : Router) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
   let count = 0;
   
   this.excludedUrl.forEach((element : any) => { 
    if (req.url === element.url) {
       count ++;
    }
   });

   if(count > 0 ){  
      return next.handle(req);  
   }else{
    const cloneReq = req.clone({ url: this.servidor + req.url });  
    if(cloneReq.method == 'POST'){
      this.servicio.loading.emit(true);
    }
    return next.handle(cloneReq).pipe(
      tap(event => this.handleHttpEvent(event)),
      catchError(error => this.handleError(error))
    );
   }
  

   
  }
  
  private handleHttpEvent(event: HttpEvent<any>): void {
    if (event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.Response) {
      this.serLoad.restar.emit(1);
    }
    if (event instanceof HttpResponse) {
      this.handleHttpResponse(event);
    }
  }
  
  private handleHttpResponse(response: HttpResponse<any>): void {
   this.servicio.loading.emit(false);
    switch (response.status) {
      case 200:
        this.handleSuccessResponse(response.body);
        break;
      case 203:
        this.servicio.setAlert('No posee privilegios', 'warning');
        break;
      case 204:
        this.servicio.setAlert('Registro posiblemente no encontrado', 'warning');
        break;
    }
  }
  
  private handleSuccessResponse(body: any): void {
    try {
      if (Array.isArray(body)) {
        body.forEach(element => {
          if (element.mensaje.length > 0) {      
            this.servicio.setAlert( element.mensaje, element.type);
          }
        });
      }
    } catch (e) {
      // Manejar cualquier error durante el procesamiento del cuerpo de la respuesta
    }
  }
  
  private handleError(error: any): Observable<never> {
    let errorMessage = '';
  
    if (error instanceof ErrorEvent) {
      errorMessage = `Error en el cliente (interceptor): ${error.error.message}`;
    } else {
      switch (error.status) {
        case 406:
          this.servicio.setAlert('No se encuentra información', 'danger');
          break;
        case 403:
          this.router.navigate(['home/seguridad/noautorizado']);
          break;
        default:
          errorMessage = `Error en el servidor (interceptor): ${error.message || 'Error desconocido'}`;
      }
    }
  
    return throwError(errorMessage);
  }
  
}
