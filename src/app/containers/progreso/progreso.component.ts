import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.component.html',
  styleUrls: ['./progreso.component.css']
})
export class ProgresoComponent implements OnInit {

  @Input() value: number | undefined;
  progreso: number        = 0;
  val          : boolean  = true;
  isLoading               = false;


  
  constructor() { }

  ngOnInit(): void {

      
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      if(changes['value'].currentValue < 100){
        setInterval(() => {
          if (this.progreso < 100) {
            this.val       = true;
            this.progreso++;
          }
        }, 60);
      }else{
         
        setTimeout(()=> {
          this.progreso = 0;      
          this.val = false;
        
       },1500 );
     
      }
    }
  }

}
