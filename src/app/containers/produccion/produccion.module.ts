import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepicker , NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {  ModalModule } from '@coreui/angular';
import {TrabExtrusionComponent} from './trab-extrusion/trab-extrusion.component';
import {ProduccionRoutingModule} from './produccion-routing.module';
import {TrabMezclaComponent} from './trab-mezcla/trab-mezcla.component';
import {TrabOrdenProduccionComponent} from './trab-orden-produccion/trab-orden-produccion.component';
import{TrabOrdenTrabajoComponent} from './trab-orden-trabajo/trab-orden-trabajo/trab-orden-trabajo.component';
import{VerImpresionComponent} from './visualizadores/ver-impresion/ver-impresion.component';
import{VerImpresionDetComponent} from './visualizadores/ver-impresion/ver-impresion-det/ver-impresion-det.component';
import{VerInyeccionComponent} from './visualizadores/ver-inyeccion/ver-inyeccion.component';
import{VerInyeccionDetComponent} from './visualizadores/ver-inyeccion/ver-inyeccion-det/ver-inyeccion-det.component';
import{VerTermoformadoComponent} from './visualizadores/ver-termoformado/ver-termoformado.component';
import{VerTermoformadoDetComponent} from './visualizadores/ver-termoformado/ver-termoformado-det/ver-termoformado-det.component';
import {InsOrdenProduccionComponent} from './trab-orden-produccion/ins-orden-produccion/ins-orden-produccion.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgileModule } from 'src/app/agileModule.module';
@NgModule({
  declarations: [TrabExtrusionComponent , 
                 TrabMezclaComponent,
                 TrabOrdenProduccionComponent,
                 TrabOrdenTrabajoComponent,
                 VerImpresionComponent,
                 VerImpresionDetComponent,
                 VerInyeccionComponent,
                 VerInyeccionDetComponent,
                 VerTermoformadoComponent,
                 VerTermoformadoDetComponent,
                 InsOrdenProduccionComponent],
  imports: [
    ProduccionRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    FontAwesomeModule,
    ModalModule,
    NgbModule,
    NgbDatepicker,
    AgileModule,
    NgSelectModule
]
})
export class ProduccionModule { }
