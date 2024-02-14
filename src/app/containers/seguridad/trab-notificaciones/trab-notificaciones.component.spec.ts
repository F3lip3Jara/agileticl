import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabNotificacionesComponent } from './trab-notificaciones.component';

describe('TrabNotificacionesComponent', () => {
  let component: TrabNotificacionesComponent;
  let fixture: ComponentFixture<TrabNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabNotificacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
