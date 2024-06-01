import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';
import { LoadingService } from 'src/app/servicios/loading.service';
import { Loading } from '../../../model/loading';
@Component({
  selector: 'app-default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss'],
})
export class DefaultFooterComponent extends FooterComponent {

  progreso            :number   = 0;
  load                          = new Loading(0);
  loadx                         = new Loading(0);
  valor                         = '';

  constructor(  private serviLoad         : LoadingService        ) {
    super();
  }

  ngAfterViewInit(): void {
    this.serviLoad.sumar.subscribe(data=>{
      this.load.setTotal(data*2);
      this.loadx.setTotal(data*2);
    });  
    
  this.serviLoad.restar.subscribe((data:any)=>{
    let total      = this.load.total;
    let diferencia = this.loadx.total;

    if(total > 0){
      diferencia     = diferencia - data;
      this.loadx.setTotal(diferencia);
      if(diferencia > 0){
          this.progreso = (diferencia*100)/total;
          this.valor    = this.progreso.toString();
      }else{
        if(diferencia == 0){
          this.progreso = 100;
          setTimeout(()=> {
            this.progreso = 0;
            this.load.setTotal(0);
            this.loadx.setTotal(0);
            },1000 );
        }
      }
    }});
  
  }
}
