import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";;
import {TrabUserComponent} from './trab-user/trab-user.component'
import {InsUserComponent} from './trab-user/ins-user/ins-user.component'
import {TrabEtapasComponent} from './trab-etapas/trab-etapas.component'
import {TrabEtapaDetalleComponent} from './trab-etapa-detalle/trab-etapa-detalle.component'
import { TrabLogComponent } from "./trab-log/trab-log.component";
import { TrabModulosComponent } from "./trab-modulos/trab-modulos.component";
import { TrabNotificacionesComponent } from "./trab-notificaciones/trab-notificaciones.component";
import { TrabOpcionesComponent } from "./trab-opciones/trab-opciones.component";
import { TrabRolesModulosComponent } from "./trab-roles-modulos/trab-roles-modulos.component";
import { TrabRolesOpcionesComponent } from "./trab-roles-opciones/trab-roles-opciones.component";
import { TrabRolesComponent } from "./trab-roles/trab-roles.component";
import { TrabSubopcionesComponent } from "./trab-subopciones/trab-subopciones.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Seguridad',
    },
    children: [
      {
        path: 'usuarios',
        component: TrabUserComponent,
        data: {
          title: 'Usuarios',
        }
      },
      {
        path: 'usuarios/ingreso',
        component: InsUserComponent,
        data: {
          title: 'Usuarios / Ingreso',
        }
      },
      {
        path: 'etapas',
        component: TrabEtapasComponent,
        data: {
          title: 'Etapas',
        }
      },
      {
        path: 'etapas/etapas_des',
        component:TrabEtapaDetalleComponent ,
        data: {
          title: 'Etapas /  Etapas-Detalle',
        }
      },
      {
        path: 'log',
        component:TrabLogComponent ,
        data: {
          title: 'Log',
        }
      },
      {
        path: 'modulos',
        component:TrabModulosComponent ,
        data: {
          title: 'Módulos',
        }
      },
      {
        path: 'notificaciones',
        component:TrabNotificacionesComponent ,
        data: {
          title: 'Notificaciones',
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
        path: 'roles',
        component:TrabRolesComponent,
        data: {
          title: 'Roles',
        }
      },
      {
        path: 'sub_opciones',
        component:TrabSubopcionesComponent,
        data: {
          title: 'Sub Opciones',
        }
      }
      ,
      {
        path: 'roles_modulos',
        component:TrabRolesModulosComponent,
        data: {
          title: 'Roles - Módulo',
        }
      },
      {
        path: 'roles_opciones',
        component:TrabRolesOpcionesComponent,
        data: {
          title: 'Roles - Opciones',
        }
      }
      
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeguridadRoutingModule {}

