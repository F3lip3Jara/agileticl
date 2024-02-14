import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";;
import {TrabGerenciaComponent} from './trab-gerencia/trab-gerencia.component'
import { TrabCalendarioJulComponent } from "./trab-calendario-jul/trab-calendario-jul.component";
import { TrabBincorComponent } from "./trab-bincor/trab-bincor.component"
import { TrabPaisComponent } from "./trab-pais/trab-pais.component";
import { TrabRegionComponent } from "./trab-region/trab-region.component";
import { TrabCiudadComponent } from "./trab-ciudad/trab-ciudad.component";
import { TrabComunaComponent } from "./trab-comuna/trab-comuna.component";
import { TrabMaquinasComponent } from "./trab-maquinas/trab-maquinas.component";
import { TrabColorComponent } from "./trab-color/trab-color.component";
import { TrabGrupoComponent } from "./trab-grupo/trab-grupo.component";
import { TrabSubGrupoComponent } from "./trab-sub-grupo/trab-sub-grupo.component";
import { TrabProductosComponent } from "./trab-productos/trab-productos.component";
import {UpProductosComponent} from './trab-productos/up-productos/up-productos.component';
import { InsProductosComponent } from "./trab-productos/ins-productos/ins-productos.component";
import {TrabUnidadMedidaComponent} from './trab-unidad-medida/trab-unidad-medida.component';
import {TrabEquivalenciaComponent} from './trab-equivalencia/trab-equivalencia.component'
import { TrabMonedasComponent } from "./trab-monedas/trab-monedas.component";
import { TrabMovRechazoComponent } from "./trab-mov-rechazo/trab-mov-rechazo.component";
import { TrabProveedoresComponent } from "./trab-proveedores/trab-proveedores.component";
import {InsProveedoresComponent} from './trab-proveedores/ins-proveedores/ins-proveedores.component';
import {UpProveedorComponent} from './trab-proveedores/up-proveedor/up-proveedor.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Parámetros',
    },
    children: [
      {
        path: 'gerencia',
        component: TrabGerenciaComponent,
        data: {
          title: 'Gerencia',
        }
      },
      {
        path: 'cal_juliano',
        component: TrabCalendarioJulComponent,
        data: {
          title: 'Calendario Juliano',
        }
      },
      {
        path: 'correlativos',
        component: TrabBincorComponent,
        data: {
          title: 'Correlativos',
        }
      },
    
      {
        path: 'pais',
        component: TrabPaisComponent,
        data: {
          title: 'Geolocalización / País',
        }
      },
      {
        path: 'region',
        component: TrabRegionComponent,
        data: {
          title: 'Geolocalización / Región',
        }
      },
      {
        path: 'ciudad',
        component: TrabCiudadComponent,
        data: {
          title: 'Geolocalización / Ciudad',
        }
      },
      {
        path: 'comuna',
        component: TrabComunaComponent,
        data: {
          title: 'Geolocalización / Comuna',
        }
      },
      {
        path: 'maquina',
        component: TrabMaquinasComponent,
        data: {
          title: 'Maquina',
        }
      },
      {
        path: 'color',
        component: TrabColorComponent,
        data: {
          title: 'Color',
        }
      },
      {
        path: 'grupo',
        component: TrabGrupoComponent,
        data: {
          title: 'Grupo',
        }
      },
      {
        path: 'sub_grupo',
        component: TrabSubGrupoComponent,
        data: {
          title: 'Sub Grupo',
        }
      },
      {
        path: 'productos',
        component: TrabProductosComponent,
        data: {
          title: 'Productos',
        }
      },
      {
        path: 'productos/actualizar',
        component: UpProductosComponent,
        data: {
          title: 'Productos / Actualizar',
        }
      },
      {
        path: 'productos/ingreso',
        component: InsProductosComponent,
        data: {
          title: 'Productos / Ingreso',
        }
      },
      {
        path: 'unidad',
        component: TrabUnidadMedidaComponent,
        data: {
          title: 'Unidad de medida',
        }
      },
      {
        path: 'equivalencia',
        component: TrabEquivalenciaComponent,
        data: {
          title: 'Equivalencia',
        }
      },
      {
        path: 'moneda',
        component: TrabMonedasComponent,
        data: {
          title: 'Moneda',
        }
      },
      {
        path: 'motivo',
        component: TrabMovRechazoComponent,
        data: {
          title: 'Motivo de Rechazo',
        }
      },
      {
        path: 'proveedor',
        component: TrabProveedoresComponent,
        data: {
          title: 'Proveedores',
        }
      },
      {
        path: 'proveedor/ingreso',
        component: InsProveedoresComponent,
        data: {
          title: 'Proveedores / Ingreso',
        }
      },
      {
        path: 'proveedor/actualizar',
        component: UpProveedorComponent,
        data: {
          title: 'Proveedores / Actualizar',
        }
      }
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrosRoutingModule {}

