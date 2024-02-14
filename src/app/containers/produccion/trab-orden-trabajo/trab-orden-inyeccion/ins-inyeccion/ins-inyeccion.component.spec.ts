import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsInyeccionComponent } from './ins-inyeccion.component';

describe('InsInyeccionComponent', () => {
  let component: InsInyeccionComponent;
  let fixture: ComponentFixture<InsInyeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsInyeccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsInyeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
