import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";;
import {TrabExtrusionComponent} from './trab-extrusion/trab-extrusion.component';
import { TrabMezclaComponent } from "./trab-mezcla/trab-mezcla.component";
import { TrabOrdenProduccionComponent } from "./trab-orden-produccion/trab-orden-produccion.component";
import { TrabOrdenTrabajoComponent } from "./trab-orden-trabajo/trab-orden-trabajo/trab-orden-trabajo.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Producción',
    },
    children: [
      {
        path: 'mezcla',
        component: TrabMezclaComponent,
        data: {
          title: 'Mezcla',
        }
      },
      {
        path: 'extrusion',
        component: TrabExtrusionComponent,
        data: {
          title: 'Extrusión',
        }
      },
      {
        path: 'ordenProduccion',
        component: TrabOrdenProduccionComponent,
        data: {
          title: 'Orden de Producción',
        }
      },
      {
        path: 'ordenTrabajo',
        component: TrabOrdenTrabajoComponent,
        data: {
          title: 'Orden de Trabajo',
        }
      }

      
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProduccionRoutingModule {}

