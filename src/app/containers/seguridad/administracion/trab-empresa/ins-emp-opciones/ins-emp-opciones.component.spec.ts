import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsEmpOpcionesComponent } from './ins-emp-opciones.component';

describe('InsEmpOpcionesComponent', () => {
  let component: InsEmpOpcionesComponent;
  let fixture: ComponentFixture<InsEmpOpcionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsEmpOpcionesComponent]
    });
    fixture = TestBed.createComponent(InsEmpOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
