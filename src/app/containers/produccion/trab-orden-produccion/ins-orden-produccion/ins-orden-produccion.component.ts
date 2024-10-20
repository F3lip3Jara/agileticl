import { LinksService } from './../../../../servicios/links.service';
import { AlertasService } from './../../../../servicios/alertas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ins-orden-produccion',
  templateUrl: './ins-orden-produccion.component.html',
  styleUrls: ['./ins-orden-produccion.component.css']
})
export class InsOrdenProduccionComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;

  insPrd       : FormGroup;
  insOrd       : FormGroup;
  token        :string                = '';
  proveedores  : any;
  carga        : string               = "";
  val          : boolean              = false;
  loading      : boolean              = false;
  dtOptions    : DataTables.Settings  = {} ;
  parametros   : any []               = [];
  prvNom       :string                = '';
  idPrv        :number                = 0;
  productos    : any [];
  cProductos   : any ;
  ordenes      : any []               = [];
  valcod       : boolean              = false;
  orpdTotP     : number               = 0;
  valprod                             = true;
  valproddet                          = false;
  etapas       : any ;
  valcprod     : boolean              = false;

  constructor(
    private servicio     : UsersService,
    private fb           : FormBuilder,
    private rest         : RestService,
    private modal        : NgbModal,
    private servicioaler : AlertasService,
    private servicioLink : LinksService,
    ) {

      this.token    = this.servicio.getToken();
      this.insPrd   = fb.group({
                                  prdCod : ['' , Validators.compose([
                                    Validators.required,
                                  ])],
                                  orpdCant: ['' , Validators.compose([
                                    Validators.required,
                                    Validators.pattern('^-?[0-9]\\d*?$')
                                  ])],
                                  orpdCantDis: ['' , Validators.compose([
                                    Validators.required,
                                    Validators.pattern('^-?[0-9]\\d*?$')
                                  ])],
                                  orpdObs: ['' , Validators.compose([
                            
                                  ])]
                        });

      this.insOrd   = fb.group({
                       orpFech : ['' , Validators.compose([
                      
                        ])],
                        orpNumOc : ['' , Validators.compose([
                         Validators.required,
                        ])],
               
                        orpObs : ['' , Validators.compose([
                        ])],
               
                        orpNumRea : ['' , Validators.compose([
                         Validators.required,
                        ])],
               
                        idEta:['', Validators.compose([
                         Validators.required
                       ]) ]
               
                     });

        this.productos = [];
        this.cProductos= [];
        this.etapas    = {};
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

      this.rest.get('prodTerm' , this.token , this.parametros).subscribe(data => {
        this.cProductos = data;
      });

      this.insPrd.controls['prdCod'].valueChanges.pipe(
        filter(text => text != null &&  text.length > 1
          ),
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe( field => {   
        if(this.valcprod == true){
            this.valcprod = false;
        }else{
          this.productos   = [];          
          this.cProductos.filter(
              (producto : any) =>{
                  if((producto.prdCod.indexOf(field) > -1) == true){
                    this.productos.push(producto);
                    this.valprod   = false;
                  }else{
                  if((producto.prdDes.indexOf(field) > -1) == true){
                    this.productos.push(producto);
                    this.valprod   = false;
                  }
                  }
              });
        }        
      });
     
      this.insOrd.controls['orpNumRea'].valueChanges.pipe(
        filter(text => text.length > 1),
        debounceTime(200),
        distinctUntilChanged()).subscribe(field => {
          this.validaNumRea(field);
        });

        let etapas      = [5,7,8];
        this.parametros = [{"key": "etapas" , "value" :etapas}];

      this.rest.get('etapasProd' , this.token , this.parametros).subscribe(data =>{
          this.etapas	= data;
       });

  }

  proveedor(content : any){
    this.valcod    = false;
    this.productos = [];
    this.valproddet= false;
    this.modal.open(content , {size:'xl'});
    this.tblData();
  }

  public tblData(){
    this.proveedores = {};
    this.rest.get('selCliente' , this.token, this.parametros).subscribe(data => {
        this.proveedores = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },3000 );
   }

   cambio(xproveedor: any){
      this.idPrv = xproveedor.id;
      this.prvNom= xproveedor.nombre
      this.modal.dismissAll();
   }

   agregar(prdCod : string , prdDes : string , orpdCant: any , orpdCantDis  : any , orpdObs:any){

     this.orpdTotP = orpdCant - orpdCantDis;

    if(this.orpdTotP <= 0){
      this.servicioaler.setAlert('Revisar!! no se puede producir cantidades en negativo','warning');
      this.servicioaler.disparador.emit(this.servicioaler.getAlert());

      setTimeout(()=>{
        this.servicioaler.setAlert('','');
      },2000);

    }else{
      this.parametros = [{"key": "prdCod" , "value" : prdCod}];  
      
      this.rest.get('valPrdCod', this.token , this.parametros).subscribe(data => {
        if(data == 1){       
              this.valprod = false;
        }else{        
            this.valprod   = true;
        }
       });
     
       if(this.valprod == true){
        this.servicioaler.setAlert('Producto no valido','warning');
        this.servicioaler.disparador.emit(this.servicioaler.getAlert());
  
        setTimeout(()=>{
          this.servicioaler.setAlert('','');
        },2000);

        let elemprdCod   = <HTMLInputElement> document.getElementById('prdCod');
        let elemprdDes   = <HTMLInputElement> document.getElementById('prdDes');
        elemprdCod.value = '';
        elemprdDes.value = '';
  
       }else{
        //Valido que no se puede agregar el mismo producto en el array
        let valiPrd      = false;
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
            'orpdCantDis' : orpdCantDis,
            'orpdTotP'    : this.orpdTotP,
            'orpdObs'     : orpdObs
        });
        }else{
          this.servicioaler.setAlert('No se puede solicitar el mismo producto en un OP','warning');
          this.servicioaler.disparador.emit(this.servicioaler.getAlert());        } 
          this.insPrd.reset();
          this.modal.dismissAll();
          this.valcprod     = false;
       }      
    }
   }


   selPrd(selprd: any){
      this.modal.open(selprd);
   }

 selectorPrd(xproducto:any){
     this.productos   = [];
     let elemprdCod   = <HTMLInputElement> document.getElementById('prdCod');
     let elemprdDes   = <HTMLInputElement> document.getElementById('prdDes');
     elemprdCod.value = xproducto.prdCod;
     elemprdDes.value = xproducto.prdDes;
     this.insPrd.controls['prdCod'].setValue( xproducto.prdCod);
     this.valcprod    = true; 
   }

   delPrd(index:any){
     this.ordenes.splice(index , 1);
   }

   generaOP(orpFech: any ,orpNumOc : any , orpNumRea: any  , orpObs : any , idEta: any ){
       let ordenPrd : any [] = [];
       this.val              = true;
      ordenPrd.push({
          'orpFech'  : orpFech,
          'orpNumOc' : orpNumOc,
          'orpNumRea': orpNumRea,
          'orpObs'   : orpObs,
          'idPrv'    : this.idPrv,
          'ordenes'  : this.ordenes,
          'idEta'    : idEta
      });

      this.rest.post('insOrd', this.token, ordenPrd).subscribe(resp => {
       resp.forEach((elementx : any)  => {
        this.servicioaler.disparador.emit(this.servicioaler.getAlert());
        if(elementx.error == '0'){      
              this.servicioaler.setAlert('','');
              this.val        = false;
              this.valproddet = false;
              const d = 'op';             
              this.insPrd.reset();
              this.servicioLink.disparador.emit(d);
        }else {
          this.val      = false;
        }
      });
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
    const d = 'op';
    this.servicioLink.disparador.emit(d);
    return false;
  }
}
