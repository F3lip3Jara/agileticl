import { Observable, merge } from 'rxjs';
import { AlertasService } from './../../../servicios/alertas.service';
import { LinksService } from './../../../servicios/links.service';
import { RestService } from './../../../servicios/rest.service';
import { UsersService } from './../../../servicios/users.service';
import { Subject, OperatorFunction } from 'rxjs';
import { NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/servicios/excel.service';
import { distinctUntilChanged, debounceTime, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-trab-orden-produccion',
  templateUrl: './trab-orden-produccion.component.html',
  styleUrls: ['./trab-orden-produccion.component.css']
})
export class TrabOrdenProduccionComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;
  @ViewChild("orpNumRea")  orpNumRea? : ElementRef;

  @ViewChild('instance', {static: true}) instance?: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();


  dtOptions    : DataTables.Settings  = {} ;
  loading      : boolean              = true;
  tblOrdenPrd  : any                  = {};
  producto     : any                  = {};
  filtroOp     : UntypedFormGroup;
  token        : string               = '';
  parametros   : any []               = [];
  statesx      : any                  ;
  states       : string[]             = [];
 // upPrd        : FormGroup             ;
  carga        : string               = "invisible";
  model        : any;
  xorden       : any;
  xorddet      : any                  = {};
  ot           : any []               = [];
  val          : boolean              = false;
  cargad       : boolean              = false;
  valJul       : boolean              = false;
  valEqui      : boolean              = true;

  constructor(private servicio    : UsersService ,
              private servicioget : RestService,
              private modal       : NgbModal,
              private fb          : UntypedFormBuilder,
              private excel       : ExcelService,
              private servicioLink: LinksService,
              private servicioAlert: AlertasService
    ) {

      this.filtroOp = fb.group({
        orpNumRea : ['']

      });
      this.token = this.servicio.getToken();
    }

      search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
        const inputFocus$ = this.focus$;

        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
        map(term => (term === '' ? this.states
        : this.states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
        );
      }



ngOnInit(): void {
  this.tblData();
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 50,
    lengthMenu : [20,50,100, 200],

    processing: true,
    language: {
      emptyTable: '',
      zeroRecords: 'No hay coincidencias',
      lengthMenu: 'Mostrar _MENU_ elementos',
      search: 'Buscar:',
      info: 'De _START_ a _END_ de _TOTAL_ elementos',
      infoEmpty: 'De 0 a 0 de 0 elementos',
      infoFiltered: '(filtrados de _MAX_ elementos totales)',
      paginate: {
        first: 'Prim.',
        last: 'Últ.',
        next: 'Sig.',
        previous: 'Ant.'
      }
    }}
    this.parametros = [];
    this.servicioget.get('opNumRea' , this.token, this.parametros).subscribe(data => {
      this.statesx = data;
     this.statesx.forEach((element: any) => {
       this.states.push(element.orpNumRea);
     });

     this.servicioget.get('diaJul', this.token , this.parametros).subscribe(data =>{ 
       if(data =='0'){
         this.valJul = true;
       }else{
         this.loading = false;
         this.carga   = 'visible';
       }
     });
   });

}


ngAfterViewInit(): void {
}
  public buscar(orpNumRea : string ){
    if (orpNumRea){
      this.loading      = true;
      let parm : any[]  = [{key :'orpNumRea' ,value: orpNumRea} ];
      this.tblOrdenPrd = {};
      this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
          dtInstance.destroy().draw();
        });
      this.servicioget.get('filopNumRea' , this.token, parm).subscribe(respuesta => {
          this.tblOrdenPrd = respuesta;
          this.loading      = false;
         });
    }else{
      this.servicioAlert.setAlert('Debe ingresar un filtro', 'warning');

    }
    setTimeout(()=> {
      this.servicioAlert.setAlert('', '');
   },2000 );
  }


  public tblData(){
    this.tblOrdenPrd = {};
    this.servicioget.get('trabOrden' , this.token, this.parametros).subscribe(respuesta => {
      this.tblOrdenPrd = respuesta;
     });

     setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1000 );
  }

  public refrescar(){
     this.loading       = true;
     this.carga         = 'invisible';
     this.tblOrdenPrd   = {};

     this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
      dtInstance.destroy().draw();
    });
     this.servicioget.get('trabOrden' , this.token, this.parametros).subscribe(respuesta => {
       this.tblOrdenPrd = respuesta;
       setTimeout(()=> {
        this.loading = false;
        this.carga   = 'visible';
      },1000);
    });
    this.filtroOp = this.fb.group({
      orpNumRea : [''],
      });
  }

  public Excel(){
      this.excel.exportAsExcelFile(this.tblOrdenPrd, 'orden_producción');
      return false;
  }

  public ordNuevo(){
    const d = 'insOp';
    this.servicioLink.disparador.emit(d);
 }

 addOT(orden: any , content : any){

  if(this.valJul){
    this.servicioAlert.setAlert('Debe ingresar calendario juliano', 'warning');
  }else{   
    this.xorden       = orden ;
    let idOrp         = this.xorden.id ;
    let parm : any[]  = [{key :'idOrp' ,value: idOrp} ];
    this.xorddet      = {};
    this.cargad       = false;
   

    this.servicioget.get('OrdPDetDta' , this.token, parm).subscribe(respuesta => {
          this.xorddet = respuesta; 
          this.valEqui = false;             
          this.xorddet.forEach((element:any) => {
            let parm : any[]  = [{key :'prdCod' ,value: element.orpdPrdCod} ];
            this.servicioget.get('valEquiPrd' , this.token, parm).subscribe(respuesta => {
              console.log(respuesta);
              if(respuesta == "error"){
                this.valEqui = true;        
                console.log(this.valEqui);                    
              }                        
            });                  
          }); 
          this.cargad  = true;    
      });    

      this.ot          = [];
     
       
        if(this.valEqui){
          this.servicioAlert.setAlert('Productos sin equivalencia', 'warning');
        }else{
          this.modal.open(content , { size: 'xl' });
        }    
    

    }
 }

 argrerDet(ord : any  , valor: any){
   if(valor['checked'] == true){      
      this.ot.push(ord);    
   }else{
      let orpdPrdCod = ord.orpdPrdCod;
      let count      = 0;
     this.ot.forEach((element : any) => {
          if(element.orpdPrdCod == orpdPrdCod) {
                this.ot.splice(count , 1);
          }
          count= count + 1;
      });
   }
 }

 guardarOT(idOrp : any , orptPrio: any ){
  console.log(this.valEqui);
    let ordenTrab: any [] = [];
    this.val              = true;
    ordenTrab.push({ 'idOrp'    : idOrp, 'orptPrio' : orptPrio,'otdet': this.ot });
     this.servicioget.post('insOT', this.token, ordenTrab).subscribe(resp => {       
      resp.forEach((elementx : any)  => {
        if(elementx.error == '0'){
            setTimeout(()=>{
              this.servicioAlert.setAlert('','');
              this.val      = false;
            },3000);
           this.ot    = [];
          this.modal.dismissAll();
          this.refrescar();
        }else {
          this.val      = false;
        }
      });
  });
  
   
 }

 verOT(ot : any , content : any){
  this.xorden       = ot ;
   let idOrp         = this.xorden.id ;
   let parm : any[]  = [{key :'idOrp' ,value: idOrp} ];
   this.xorddet      = {};
   this.cargad       = false;
   this.servicioget.get('OrdPDet' , this.token, parm).subscribe(respuesta => {
        this.xorddet = respuesta;
        this.cargad  = true;
    });    
    this.ot          = [];
    this.modal.open(content , { size: 'xl' });
 }

}
