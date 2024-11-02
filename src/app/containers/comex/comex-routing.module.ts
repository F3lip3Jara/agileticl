import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";import { TrabEmbarquesComponent } from "./trab-embarques/trab-embarques.component";
;


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Comex',
    },
    children: [
      {
        path: 'embarque',
        component: TrabEmbarquesComponent,
        data: {
          title: 'Embarque',
        }
      }

      
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComexRoutingModule {}

