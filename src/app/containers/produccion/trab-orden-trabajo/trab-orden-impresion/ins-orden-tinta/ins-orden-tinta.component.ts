import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';


@Component({
  selector: 'app-ins-orden-tinta',
  templateUrl: './ins-orden-tinta.component.html',
  styleUrls: ['./ins-orden-tinta.component.css']
})
export class InsOrdenTintaComponent implements OnInit {

insTinta     : FormGroup;
val          : boolean = false;
insumos      : any;
@Output() onItemAdded: EventEmitter<any>;
token        : string               = '';
parametros   : any []               = [];

  constructor(  private fg       : FormBuilder,
                private modal    : NgbModal,
                private serviRest: RestService,
                private servicio : UsersService) {  
                  
    this.insumos  = {};
    this.insTinta = fg.group({
      impPrdTinta    : ['', Validators.compose([
      Validators.required
   
      ])],
      impPrdLote : ['', Validators.compose([
        Validators.required     
        ])]
    });
    this.onItemAdded = new EventEmitter();
    this.token       = this.servicio.getToken();
   }

  ngOnInit(): void {
    this.serviRest.get('prodInsumo', this.token , this.parametros).subscribe(data => {
      this.insumos = data;
    });    
  }

  insTin(impPrdTinta : any  , impPrdLote :any){  
    this.insTinta.reset();
    this.modal.dismissAll();
    let tinta  = {'impPrdTinta' : impPrdTinta , 'impPrdLote' : impPrdLote };
    this.onItemAdded.emit(tinta);
  }

  insCtlTinta(content : any){
    this.modal.open(content);
  }


}
