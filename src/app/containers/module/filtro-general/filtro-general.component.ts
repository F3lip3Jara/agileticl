import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { faFilter, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filtro-general',
  templateUrl: './filtro-general.component.html',
  styleUrls: ['./filtro-general.component.scss']
})
export class FiltroGeneralComponent {

  faFilter                                               = faFilter;
  @Input() colums : string[]                             = [] ; // Todas las columnas originales
  availableColumns: {column  : string , active:string}[] = []; // Columnas disponibles para seleccionar
  selectedFilters : {  column: string, values: any[] }[] = []; // Filtros seleccionados
  filters         : any                                  = {}; // Filtros finales a enviar
  parametros      : any                                  = [];
  faTrashCan                                             = faTrashCan; 
  @Output() onItemAdded: EventEmitter<any>;
  @ViewChild('dropdown') dropdown?: any;

  autoCloseValue: boolean | 'inside' | 'outside' = 'outside';
  constructor(){
    this.onItemAdded = new EventEmitter();
   
  }
  ngAfterViewInit(): void {
   
  }

  ngOnInit(): void {
   this.colums.forEach(element => {
      if(element != "empId"){
        this.availableColumns.push({column: element ,active:"s"});
      }
    });

   if(this.selectedFilters.length == 0){
     this.selectedFilters.push({ column: '', values: [] });
   }
  }

  addFilter() {  
    this.selectedFilters.push({ column: '', values: [] });
  }

  onColumnChange(filter: any) {  
      // Actualizar el estado de la columna actualmente seleccionada
      const column = this.availableColumns.find(col => col.column === filter.column);
      if (column) {
        column.active = 'n';
      }
  }


  getAvailableColumns(index: number) {
    // Obtén las columnas activas o la columna actualmente seleccionada en este select
    return this.availableColumns.filter(column => 
      column.active === 's' || column.column === this.selectedFilters[index]?.column
    );
  }   


// Eliminar filtro y restaurar el estado de la columna
  removeFilter(index: number) {
      const removedFilter = this.selectedFilters[index];
      const column        = this.availableColumns.find(col => col.column === removedFilter.column);
      if (column) {
        column.active = 's';
      }
    this.selectedFilters.splice(index, 1);
  }                                           

  // Método para aplicar los filtros
  applyFilters() {
    let filter      = btoa(JSON.stringify(this.selectedFilters));
    this.parametros = [{key :'filter' ,value: filter}];
    this.onItemAdded.emit(this.parametros);
    this.dropdown.setVisibleState(false)
  }

}
