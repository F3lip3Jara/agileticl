import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";import { TrabCentroComponent } from "./centro/trab-centro/trab-centro.component";
import { TrabAlmacenComponent } from "./centro/trab-almacen/trab-almacen.component";
import { TrabTipClassComponent } from "./trab-tip-class/trab-tip-class.component";

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
      }

      
    
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SdRoutingModule {}

