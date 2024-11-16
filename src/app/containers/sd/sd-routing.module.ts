import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";import { TrabCentroComponent } from "./centro/trab-centro/trab-centro.component";
import { TrabAlmacenComponent } from "./centro/trab-almacen/trab-almacen.component";
import { TrabTipClassComponent } from "./trab-tip-class/trab-tip-class.component";
import { TrabOrdenesWmsComponent } from "./trab-ordenes-wms/trab-ordenes-wms.component";
import { TrabSectorComponent } from "./centro/trab-sector/trab-sector.component";
import { TrabStocksComponent } from "./trab-stocks/trab-stocks.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Sd',
    },
    children: [
      {
        path: 'centro',
        component: TrabCentroComponent,
        data: {
          title: 'Centro',
        }
      },
      {
        path: 'centro/almacen/:centro',
        component: TrabAlmacenComponent,
        data: {
          title: 'Centro / Almacen',
        }
      },
      {
        path: 'clase_tipo',
        component: TrabTipClassComponent,
        data: {
          title: 'Clase de tipo',
        }
      },
      {
        path: 'orden_wms',
        component: TrabOrdenesWmsComponent,
        data: {
          title: 'Ordenes WMS',
        }
      },
      {
        path: 'centro/almacen/sector/:almacen',
        component: TrabSectorComponent,
        data: {
          title: 'Sectores',
        }
      },
      {
        path: 'stocks',
        component: TrabStocksComponent,
        data: {
          title: 'Stocks',
        }
      }
      
    
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SdRoutingModule {}

