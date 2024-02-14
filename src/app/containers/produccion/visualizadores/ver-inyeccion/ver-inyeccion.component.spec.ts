import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInyeccionComponent } from './ver-inyeccion.component';

describe('VerInyeccionComponent', () => {
  let component: VerInyeccionComponent;
  let fixture: ComponentFixture<VerInyeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerInyeccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerInyeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
