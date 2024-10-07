import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DireccionComponent} from './containers/direccion/direccion.component'

@NgModule({
  declarations: [DireccionComponent],
  imports: [CommonModule],
  exports: [DireccionComponent] // Exporta el componente para que otros módulos puedan usarlo
})
export class AgileModule {}