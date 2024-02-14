import { UsersService } from 'src/app/servicios/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as $ from 'jquery';
import { RestService } from 'src/app/servicios/rest.service';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { IconSubset } from 'src/app/icons/icon-subset';

@Component({
  selector: 'app-select-icon',
  templateUrl: './select-icon.component.html',
  styleUrls: ['./select-icon.component.scss']
})
export class SelectIconComponent {

  extrusiones  : any;
  carga        : string                = "";
  dtOptions    : DataTables.Settings   = {};
  parametros   : any []                = [];
  token        : string                = '';
  faMagnifyingGlass                    = faMagnifyingGlass;
  iconSubset   :any[]                  = Object.keys(IconSubset);  
  @Input() icono :string = '';
  @Output() onItemAdded: EventEmitter<any>;

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

  modalOpen(content : any){
    this.modal.open(content , { size: 'lg' });
  }

  cambio(icon : any){
    this.onItemAdded.emit(icon);
    this.modal.dismissAll();
    this.icono = icon;
    return false;
  }


}
