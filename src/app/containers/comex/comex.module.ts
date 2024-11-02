import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepicker , NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {  ModalModule } from '@coreui/angular';
import { ComexRoutingModule } from './comex-routing.module';
import { TrabEmbarquesComponent } from './trab-embarques/trab-embarques.component';

@NgModule({
  declarations: [
    TrabEmbarquesComponent
  ],
  imports: [
    ComexRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    FontAwesomeModule,
    ModalModule,
    NgbModule,
    NgbDatepicker
  ]
})
export class ComexModule { }
