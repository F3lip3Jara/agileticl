import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
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
import { VentaRoutingModule } from './venta-routing.module';
import {TrabVentaWebComponent} from './orden/trab-venta-web/trab-venta-web.component'
import { AgileModule } from 'src/app/agileModule.module';



@NgModule({
  declarations: [

  TrabVentaWebComponent
                ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    VentaRoutingModule,
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
    AgileModule
   
  ],
 
})
export class VentaModule { }
