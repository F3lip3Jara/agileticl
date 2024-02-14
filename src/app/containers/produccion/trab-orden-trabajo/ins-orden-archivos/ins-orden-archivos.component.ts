import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ins-orden-archivos',
  templateUrl: './ins-orden-archivos.component.html',
  styleUrls: ['./ins-orden-archivos.component.css']
})
export class InsOrdenArchivosComponent implements OnInit {
  insArch      : FormGroup;
  myReader     : FileReader           = new FileReader();
  nombreArch   : string               = '';
  archivo      : any                  = [];
  val          : boolean              = false;
  @Output() onItemAdded: EventEmitter<any>;

  constructor(private modal        : NgbModal,
               private fg          : FormBuilder) { 

                this.insArch = fg.group({
                  archivos    : ['', Validators.compose([
                    Validators.required,
                    ])]
                });
                this.onItemAdded = new EventEmitter();
               }

  ngOnInit(): void {
  }

  insDoc(content : any){
    this.modal.open(content);
  }
  
  capturarFile(event : any){
    const archivoCapturado = event.target.files[0];
    this.nombreArch        = event.target.files[0].name;
    try {
       
        this.myReader.readAsDataURL(archivoCapturado);
        this.myReader.onloadend = (event) => {
          this.archivo  =event.target?.result;
      }
      }
      catch(e: any){
        console.log(e);
      }
  }

  insArchivos(){
    let archivos = {'nombre': this.nombreArch , 'base64':this.archivo}; 
    this.onItemAdded.emit(archivos);
    this.modal.dismissAll();
    this.insArch.reset();     
  }
  
}
