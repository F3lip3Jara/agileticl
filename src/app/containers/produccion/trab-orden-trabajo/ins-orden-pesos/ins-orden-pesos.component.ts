import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-ins-orden-pesos',
  templateUrl: './ins-orden-pesos.component.html',
  styleUrls: ['./ins-orden-pesos.component.css']
})
export class InsOrdenPesosComponent implements OnInit {
insPeso      : FormGroup;
val          : boolean              = false;
@Output() onItemAdded: EventEmitter<any>;

  constructor(  private fg       : FormBuilder,
                private modal    : NgbModal) {    
    this.insPeso = fg.group({
      inPeso    : ['', Validators.compose([
      Validators.required,
      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')
      ])]
    });
    this.onItemAdded = new EventEmitter();
   }

  ngOnInit(): void {
  }

  insPesos(inpPeso : any){
    this.insPeso.reset();
    this.modal.dismissAll();
    this.onItemAdded.emit(inpPeso);
  }

  insCtlPeso(content : any){
    this.modal.open(content);
  }

}
