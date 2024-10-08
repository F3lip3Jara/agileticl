import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";;
import {TrabUserComponent} from './trab-user/trab-user.component'
import {TrabEtapasComponent} from '../parametros/trab-etapas/trab-etapas.component'
import { TrabLogComponent } from "./trab-log/trab-log.component";
import { TrabModulosComponent } from "./trab-modulos/trab-modulos.component";
import { TrabNotificacionesComponent } from "./trab-notificaciones/trab-notificaciones.component";
import { TrabRolesComponent } from "./trab-roles/trab-roles.component";
import { UpModuloOptComponent } from "./trab-modulos/up-modulo-opt/up-modulo-opt.component";
import { InsModuloOptComponent } from "./trab-modulos/ins-modulo-opt/ins-modulo-opt.component";
import { InsUserComponent } from "./trab-user/ins-user/ins-user.component";
import { UpUserComponent } from "./trab-user/up-user/up-user.component";
import { AjustesComponent } from "./ajustes/ajustes.component";
import { UsuarioNoautorizadoComponent } from "./usuario-noautorizado/usuario-noautorizado.component";
import { TrabSubopcionesComponent } from "./trab-modulos/trab-subopciones/trab-subopciones.component";
import { UpMolOptComponent } from "./trab-modulos/up-modulo-opt/up-mol-opt/up-mol-opt.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Seguridad',
    },
    children: [
    
      {
        path: 'noautorizado',
        component: UsuarioNoautorizadoComponent,
        data: {
          title: 'No autorizado',
        }
      },
      {
        path: 'ajustes/:usuario',
        component: AjustesComponent,
        data: {
          title: 'Usuarios',
        }
      },
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
        path: 'usuarios/actualizar/:usuario',
        component: UpUserComponent,
        data: {
          title: 'Usuarios / Actualizar',
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
        path: 'modulos/upModulo/:array',
        component:UpModuloOptComponent ,
        data: {
          title: 'Módulos - Opciones',
        }
      },
      {
        path: 'modulos/upModulo/opciones/',
        component:UpMolOptComponent ,
        data: {
          title: 'Módulos - Opciones',
        }
      },
      {
        path: 'modulos/insModulo',
        component:InsModuloOptComponent ,
        data: {
          title: 'Módulos - Opciones',
        }
      },
      {
        path: 'modulos/subopciones/:modulo',
        component:TrabSubopcionesComponent ,
        data: {
          title: 'Módulos - Opciones - Sub Opciones',
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
        path: 'roles',
        component:TrabRolesComponent,
        data: {
          title: 'Roles',
        }
      },
      {
        path: 'administracion',
        loadChildren: () =>
          import('./administracion/administracion.module').then((m) => m.AdministracionModule)
      },     
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeguridadRoutingModule {}

