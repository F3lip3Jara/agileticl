import { Component, EventEmitter, Output } from '@angular/core';
import { faHandPointer, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-select-proveedor',
  templateUrl: './select-proveedor.component.html',
  styleUrls: ['./select-proveedor.component.scss']
})
export class SelectProveedorComponent {

  extrusiones  : any;
  carga        : string                = "";
  dtOptions    : DataTables.Settings   = {};
  parametros   : any []                = [];
  token        : string                = '';
  faMagnifyingGlass                    = faMagnifyingGlass;
  faHandPointer                        = faHandPointer;
  @Output() onItemAdded: EventEmitter<any>;
  data         : any                   = {};
  proveedores  : any                   = {};
  loading                              = false;
  nombre                               = "";

  

  constructor(private modal        : NgbModal,
              private rest         : RestService,
              private servicio     : UsersService,
    ) {
      this.extrusiones = {};
      this.token       = this.servicio.getToken();
      this.onItemAdded = new EventEmitter();
      $("#modal").show();
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
  }

  modalOpen(content : any ){
    this.modal.open(content , { size: 'lg' });
    this.tblData();
  }

  cambio(data : any , modal: any){
    this.onItemAdded.emit(data);
    this.nombre = data.nombre;
    modal.close()
    this.data = data;
    return false;
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

}

