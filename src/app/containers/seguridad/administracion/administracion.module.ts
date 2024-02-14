import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import {TrabEmpresaComponent} from './trab-empresa/trab-empresa.component';
import {AdministacionRoutingModule} from './administracion-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InsEmpresaComponent } from './trab-empresa/ins-empresa/ins-empresa.component';
import { InsEmpOpcionesComponent } from './trab-empresa/ins-emp-opciones/ins-emp-opciones.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TrabOpcionesComponent } from './trab-opciones/trab-opciones.component';
import { TrabAccionesComponent } from './trab-opciones/trab-acciones/trab-acciones.component';


@NgModule({
  declarations: [
    TrabEmpresaComponent,
    InsEmpresaComponent,
    InsEmpOpcionesComponent,
    TrabOpcionesComponent,
    TrabAccionesComponent,
      ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    AdministacionRoutingModule,
    FontAwesomeModule,
    DragDropModule
  ]
})
export class AdministracionModule { }
