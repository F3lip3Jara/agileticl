import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from '@coreui/angular';
import { NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TrabGerenciaComponent } from './trab-gerencia/trab-gerencia.component';
import {TrabCalendarioJulComponent} from './trab-calendario-jul/trab-calendario-jul.component';
import {TrabBincorComponent} from './trab-bincor/trab-bincor.component';
import {TrabPaisComponent} from './trab-pais/trab-pais.component';
import {TrabRegionComponent} from './trab-region/trab-region.component';
import {TrabCiudadComponent} from './trab-ciudad/trab-ciudad.component';
import {TrabComunaComponent} from './trab-comuna/trab-comuna.component';
import {TrabMaquinasComponent} from './trab-maquinas/trab-maquinas.component';
import {TrabColorComponent} from './trab-color/trab-color.component';
import {TrabGrupoComponent} from './trab-grupo/trab-grupo.component';
import {TrabSubGrupoComponent} from './trab-sub-grupo/trab-sub-grupo.component';
import {TrabProductosComponent} from './trab-productos/trab-productos.component';
import {UpProductosComponent} from './trab-productos/up-productos/up-productos.component';
import {InsProductosComponent} from './trab-productos/ins-productos/ins-productos.component';
import {TrabUnidadMedidaComponent} from './trab-unidad-medida/trab-unidad-medida.component';
import {TrabEquivalenciaComponent} from './trab-equivalencia/trab-equivalencia.component'
import {TrabMonedasComponent} from './trab-monedas/trab-monedas.component';
import {TrabMovRechazoComponent} from './trab-mov-rechazo/trab-mov-rechazo.component';
import {TrabProveedoresComponent} from './trab-proveedores/trab-proveedores.component';
import {InsProveedoresComponent} from './trab-proveedores/ins-proveedores/ins-proveedores.component';
import {UpProveedorComponent} from './trab-proveedores/up-proveedor/up-proveedor.component';
import {UpDesProveeedorComponent} from './trab-proveedores/up-proveedor/up-des-proveeedor/up-des-proveeedor.component'
import {ParametrosRoutingModule} from './parametros-routing.module';


@NgModule({
  declarations: [TrabGerenciaComponent , 
                TrabCalendarioJulComponent,
                TrabBincorComponent,
                TrabPaisComponent,
                TrabRegionComponent,
                TrabCiudadComponent,
                TrabComunaComponent,
                TrabMaquinasComponent,
                TrabColorComponent,
                TrabGrupoComponent,
                TrabSubGrupoComponent,
                TrabProductosComponent,
                UpProductosComponent,
                InsProductosComponent,
                TrabUnidadMedidaComponent,
                TrabEquivalenciaComponent,
                TrabMonedasComponent,
                TrabMovRechazoComponent,
                TrabProveedoresComponent,
                InsProveedoresComponent,
                UpProveedorComponent,
                UpDesProveeedorComponent
                
              ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ParametrosRoutingModule,
    FontAwesomeModule,
    ModalModule,
    NgbModule,
    NgbDatepicker
  ]
})
export class ParametrosModule { }
