import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SdRoutingModule } from './sd-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepicker , NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {  AvatarModule, ModalModule } from '@coreui/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IconModule } from '@coreui/icons-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import { StepsModule } from 'primeng/steps';
import { ButtonModule as ButtonModuleP } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { StepperModule } from 'primeng/stepper';
import { TrabCentroComponent } from './centro/trab-centro/trab-centro.component';
import { GoogleMapsModule } from '@angular/google-maps';
import {AgileModule} from '../../agileModule.module';
import { TrabAlmacenComponent } from './centro/trab-almacen/trab-almacen.component';
import { TrabTipClassComponent } from './trab-tip-class/trab-tip-class.component'


@NgModule({
  declarations: [
    TrabCentroComponent,
    TrabAlmacenComponent,
    TrabTipClassComponent,
  
                ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    SdRoutingModule,
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
    StepperModule,
    GoogleMapsModule,
    AgileModule
  ],
 
})
export class SdModule { }
