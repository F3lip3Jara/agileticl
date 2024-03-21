import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './containers';
import {LoginComponent} from './login/login.component';
import { CambiopassComponent } from './containers/seguridad/cambiopass/cambiopass.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'cambiopass',
    component: CambiopassComponent,
  },
  {
    path: 'home',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      
      {
        path: 'seguridad',
        loadChildren: () =>
          import('./containers/seguridad/seguridad.module').then((m) => m.SeguridadModule)
      },
      {
        path: 'parametros',
        loadChildren: () =>
          import('./containers/parametros/parametros.module').then((m) => m.ParametrosModule)
      },
      {
        path: 'produccion',
        loadChildren: () =>
          import('./containers/produccion/produccion.module').then((m) => m.ProduccionModule)
      },
      
      
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
