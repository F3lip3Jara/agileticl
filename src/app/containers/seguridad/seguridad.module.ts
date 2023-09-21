import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabUserComponent } from './trab-user/trab-user.component';  
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepicker , NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {  ModalModule } from '@coreui/angular';
import { InsUserComponent } from './trab-user/ins-user/ins-user.component';
import {TrabEtapasComponent} from './trab-etapas/trab-etapas.component';
import {TrabEtapaDetalleComponent} from './trab-etapa-detalle/trab-etapa-detalle.component';
import {TrabLogComponent} from './trab-log/trab-log.component';
import {TrabModulosComponent} from './trab-modulos/trab-modulos.component';
import {TrabNotificacionesComponent} from './trab-notificaciones/trab-notificaciones.component';
import {TrabOpcionesComponent} from './trab-opciones/trab-opciones.component';
import {TrabRolesModulosComponent} from './trab-roles-modulos/trab-roles-modulos.component';
import {TrabRolesOpcionesComponent} from './trab-roles-opciones/trab-roles-opciones.component'
import {TrabRolesComponent} from './trab-roles/trab-roles.component';
import {TrabSubopcionesComponent} from './trab-subopciones/trab-subopciones.component';
import { SelectIconComponent } from './trab-modulos/select-icon/select-icon.component'

@NgModule({
  declarations: [TrabUserComponent , 
                 InsUserComponent ,
                 TrabEtapasComponent ,
                 TrabEtapaDetalleComponent,
                 TrabLogComponent,
                 TrabModulosComponent,
                 TrabNotificacionesComponent,
                 TrabOpcionesComponent,
                 TrabRolesModulosComponent,
                 TrabRolesOpcionesComponent,
                 TrabRolesComponent,
                 TrabSubopcionesComponent,
                 SelectIconComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    SeguridadRoutingModule,
    FontAwesomeModule,
    ModalModule,
    NgbModule,
    NgbDatepicker
  ]
})
export class SeguridadModule { }
