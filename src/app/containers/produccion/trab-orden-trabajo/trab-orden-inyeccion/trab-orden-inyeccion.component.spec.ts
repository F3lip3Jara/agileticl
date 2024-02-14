import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabOrdenInyeccionComponent } from './trab-orden-inyeccion.component';

describe('TrabOrdenInyeccionComponent', () => {
  let component: TrabOrdenInyeccionComponent;
  let fixture: ComponentFixture<TrabOrdenInyeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabOrdenInyeccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabOrdenInyeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
