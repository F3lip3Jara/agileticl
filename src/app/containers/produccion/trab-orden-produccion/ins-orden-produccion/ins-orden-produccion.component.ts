import { LinksService } from './../../../../servicios/links.service';
import { AlertasService } from './../../../../servicios/alertas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faArrowTurnDown, faCalendarWeek, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-ins-orden-produccion',
  templateUrl: './ins-orden-produccion.component.html',
  styleUrls: ['./ins-orden-produccion.component.css']
})
export class InsOrdenProduccionComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;

  insPrd       : FormGroup;
  ins          : FormGroup;
  token        :string                = '';
  proveedores  : any                  = {};
  carga        : string               = "";
  val          : boolean              = false;
  loading      : boolean              = false;
  dtOptions    : DataTables.Settings  = {} ;
  parametros   : any []               = [];
  prvId        :number                = 0;
  producto     : any                  = {};
  productos    : any [];
  cProductos   : any                  = {};
  ordenes      : any []               = [];
  valcod       : boolean              = false;
  orpdTotP     : number               = 0;
  valprod                             = true;
  valproddet                          = false;
  valcprod     : boolean              = false;
  faCalendarWeek                      = faCalendarWeek;
  centro       : any                  = [];
  almacen      : any                  = [];
  clasTip      : any                  = [];
  faPlus                              = faPlus;
  faTrash                             = faTrash;
  faArrowTurnDown                     = faArrowTurnDown;

  constructor(
    private servicio     : UsersService,
    private fb           : FormBuilder,
    private rest         : RestService,
    private modal        : NgbModal,
    private servicioaler : AlertasService,
    private servicioLink : LinksService,
    ) {

      this.token    = this.servicio.getToken();
      this.ins   = fb.group({
        orpFech : ['' , Validators.compose([
          Validators.required
         ])],
         orpNumOc : ['' , Validators.compose([
          
         ])],

         orpObs : ['' , Validators.compose([
         ])],

         orpNumRea : ['' , Validators.compose([
        
         ])],
         centroId: ['' , Validators.compose([
          Validators.required,
        ])],
        almId: ['' , Validators.compose([
          Validators.required,
        ])],
        clasTipId:['' , Validators.compose([
          Validators.required,])]

      });


      this.insPrd = fb.group({
                         prdCod : ['' , Validators.compose([
                           Validators.required,
                         ])],
                         orpdCant: ['' , Validators.compose([
                           Validators.required,
                           Validators.pattern('^-?[0-9]\\d*?$')
                         ])],
                         orpdCantDis: ['' , Validators.compose([                                   
                           Validators.pattern('^-?[0-9]\\d*?$')
                         ])],
                         orpdObs: ['' , Validators.compose([
                   
                         ])]
                                 
                      });

   
        this.productos = [];
        this.cProductos= [];
        
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
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

      this.parametros = [{"key": "prdTip" , "value" :'T'}];

      this.rest.get('prod' , this.token , this.parametros).subscribe(data => {
        this.cProductos = data;
      });

      this.rest.get('trabCentro' , this.token , this.parametros).subscribe(data => {
        this.centro = data;
      });

      this.rest.get('trabSdClass' , this.token , this.parametros).subscribe(data => {
        this.clasTip = data;
      });

      this.ins.controls['centroId'].valueChanges.pipe(        
        distinctUntilChanged()).subscribe((field:any) => {
          this.almacen = [];
          this.parametros = [{"key": "centroId" , "value" :field}];
          this.rest.get('almacenFil' , this.token , this.parametros).subscribe(data => {
            this.almacen = data;
          });
  
        });
      
  }

  
   agregar(prdCod : any ,orpdCant: any ,  orpdObs:any){
        //Valido que no se puede agregar el mismo producto en el array
        let valiPrd      = false;
        let prdDes       = this.producto.prdDes;
        this.orpdTotP    = orpdCant;
        this.ordenes.forEach(element => {
            if(element.prdCod == prdCod){
              valiPrd =true;
            }
        });        

        if(valiPrd == false){
          this.ordenes.push({
            'prdCod'      : prdCod,
            'prdDes'      : prdDes,
            'orpdCant'    : orpdCant,
            'orpdObs'     : orpdObs,
            'orpdTotP'    : this.orpdTotP
        });

        }else{
          this.servicioaler.setAlert('No se puede solicitar el mismo producto en un OP','info');
          this.servicioaler.disparador.emit(this.servicioaler.getAlert());        } 
          this.insPrd.reset();
          this.modal.dismissAll();
          this.valcprod     = false;
    }      
    

   selPrd(selprd: any){
      this.modal.open(selprd);
   }

 
   delPrd(index:any){
     this.ordenes.splice(index , 1);
   }

   generaOP(orpFech: any ,orpNumOc : any , orpNumRea: any  , orpObs : any  , centroId:any, almId:any, clasTipId:any){
       let ordenPrd : any [] = [];
       this.val              = true;
      ordenPrd.push({
          'orpFech'   : orpFech,
          'orpNumOc'  : orpNumOc,
          'orpNumRea' : orpNumRea,
          'orpObs'    : orpObs,
          'proveedor': this.proveedores,
          'ordenes'   : this.ordenes,
          'centroId'  : centroId,
          'almId'     : almId,
          'clasTipId' : clasTipId
         
      });
      console.log(ordenPrd);
      
      this.rest.post('insOrdProduccion', this.token, ordenPrd).subscribe(resp => {
           
      });

   }

  public validaNumRea(field : any){
    this.parametros = [{key :'orpNumRea' ,value: field.trim()}];
    this.rest.get('valCodNumRea' , this.token , this.parametros).subscribe((cant : any)=>{
        if(cant != 0){
          this.valcod = true;
        }else{
          this.valcod = false;
        }
    });
  }

  public volver(){
  
  }

  public proveedor(proveedor : any){
    this.proveedores = proveedor;
    this.prvId  = proveedor.id;
  }

  public onProductoSeleccionado(producto : any){
      this.producto = producto;
    
  }
}
