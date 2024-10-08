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
import { AjustesComponent } from './ajustes/ajustes.component';
import { UsuarioNoautorizadoComponent } from './usuario-noautorizado/usuario-noautorizado.component';
import { TrabSubopcionesComponent } from './trab-modulos/trab-subopciones/trab-subopciones.component';
import { StepsModule } from 'primeng/steps';
import { ButtonModule as ButtonModuleP } from 'primeng/button';
import { UpMolRolesComponent } from './trab-modulos/up-modulo-opt/up-mol-roles/up-mol-roles.component';
import { ReceptorDirective } from 'src/app/servicios/receptor.directive';
import { PickListModule } from 'primeng/picklist';
import { StepperModule } from 'primeng/stepper';
import { UpMolOptComponent } from './trab-modulos/up-modulo-opt/up-mol-opt/up-mol-opt.component';
import { InsMolOptComponent } from './trab-modulos/ins-modulo-opt/ins-mol-opt/ins-mol-opt.component';
import { InsMolRolComponent } from './trab-modulos/ins-modulo-opt/ins-mol-rol/ins-mol-rol.component';

@NgModule({
  declarations: [TrabUserComponent , 
                 InsUserComponent ,
                 TrabLogComponent,
                 TrabModulosComponent,
                 TrabNotificacionesComponent,            
                 TrabRolesComponent,                
                 SelectIconComponent,
                 UpModuloOptComponent,
                 InsModuloOptComponent,
                 UpUserComponent,
                 AjustesComponent,
                 UsuarioNoautorizadoComponent,
                 TrabSubopcionesComponent,
                 UpMolRolesComponent,
                 ReceptorDirective,
                 UpMolOptComponent,
                 InsMolOptComponent,
                 InsMolRolComponent
            
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
    AvatarModule,
    StepsModule,
    ButtonModuleP,
    PickListModule,
    StepperModule
  ],
 
})
export class SeguridadModule { }
