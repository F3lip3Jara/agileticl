import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";;
import {TrabEmpresaComponent} from './trab-empresa/trab-empresa.component';
import { InsEmpresaComponent } from "./trab-empresa/ins-empresa/ins-empresa.component";
import { InsEmpOpcionesComponent } from "./trab-empresa/ins-emp-opciones/ins-emp-opciones.component";
import { TrabOpcionesComponent } from "./trab-opciones/trab-opciones.component";
import { TrabAccionesComponent } from "./trab-opciones/trab-acciones/trab-acciones.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Administración',
    },
    children: [
      {
        path: 'empresa',
        component:TrabEmpresaComponent,
        data: {
          title: 'Empresa',
        }
      },
      {
        path: 'empresa/ins',
        component:InsEmpresaComponent,
        data: {
          title: 'Empresa - Ingreso',
        }
      },{
        path: 'empresa/opciones/:empresa',
        component:InsEmpOpcionesComponent,
        data: {
          title: 'Empresa - Opciones',
        }
      },
      {
        path: 'empresa/opciones/:empresa',
        component:InsEmpOpcionesComponent,
        data: {
          title: 'Empresa - Opciones',
        }
      },
      {
        path: 'opciones',
        component:TrabOpcionesComponent,
        data: {
          title: 'Opciones',
        }
      },
      {
        path: 'opciones/acciones/:opcion',
        component:TrabAccionesComponent,
        data: {
          title: 'Acciones',
        }
      }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministacionRoutingModule {}

