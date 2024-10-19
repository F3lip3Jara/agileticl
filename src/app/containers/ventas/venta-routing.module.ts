import { NgModule } from "@angular/core";
import { TrabVentaWebComponent } from "./orden/trab-venta-web/trab-venta-web.component";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ventas',
    },
    children: [
      {
        path: 'ventaweb',
        component: TrabVentaWebComponent,
        data: {
          title: 'Centro',
        }
      },

     

      
    
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentaRoutingModule {}

