import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabUserComponent } from './trab-user/trab-user.component';  
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepicker , NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {  AvatarModule, ModalModule } from '@coreui/angular';
import { InsUserComponent } from './trab-user/ins-user/ins-user.component';
import {TrabEtapasComponent} from './trab-etapas/trab-etapas.component';
import {TrabEtapaDetalleComponent} from './trab-etapa-detalle/trab-etapa-detalle.component';
import {TrabLogComponent} from './trab-log/trab-log.component';
import {TrabModulosComponent} from './trab-modulos/trab-modulos.component';
import {TrabNotificacionesComponent} from './trab-notificaciones/trab-notificaciones.component';
import {TrabRolesComponent} from './trab-roles/trab-roles.component';
import { SelectIconComponent } from './trab-modulos/select-icon/select-icon.component';
import { UpModuloOptComponent } from './trab-modulos/up-modulo-opt/up-modulo-opt.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IconModule } from '@coreui/icons-angular';
import { InsModuloOptComponent } from './trab-modulos/ins-modulo-opt/ins-modulo-opt.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import {UpUserComponent} from './trab-user/up-user/up-user.component';


@NgModule({
  declarations: [TrabUserComponent , 
                 InsUserComponent ,
                 TrabEtapasComponent ,
                 TrabEtapaDetalleComponent,
                 TrabLogComponent,
                 TrabModulosComponent,
                 TrabNotificacionesComponent,            
                 TrabRolesComponent,                
                 SelectIconComponent,
                 UpModuloOptComponent,
                 InsModuloOptComponent,
                 UpUserComponent
                
                ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    SeguridadRoutingModule,
    FontAwesomeModule,
    ModalModule,
    NgbModule,
    NgbDatepicker,
    DragDropModule,
    IconModule,
    ImageCropperModule,
    NgSelectModule,
    AvatarModule
  ]
})
export class SeguridadModule { }
