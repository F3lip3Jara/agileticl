import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DireccionComponent} from './containers/module/direccion/direccion.component';
import {SelectProductoComponent} from './containers/module/select-producto/select-producto.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from 'angular-datatables';
import { DropdownModule } from '@coreui/angular';
import { ChipsModule } from 'primeng/chips';
import {FiltroGeneralComponent} from './containers/module/filtro-general/filtro-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [DireccionComponent,
                SelectProductoComponent,
                FiltroGeneralComponent],
  imports: [
          CommonModule, 
          FontAwesomeModule, 
          DataTablesModule,
          DropdownModule,
          ChipsModule,
          FormsModule,
          ReactiveFormsModule,
          NgbDropdownModule
        ],
  exports: [DireccionComponent,SelectProductoComponent , FiltroGeneralComponent] // Exporta el componente para que otros módulos puedan usarlo
})
export class AgileModule {}