import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInyeccionDetComponent } from './ver-inyeccion-det.component';

describe('VerInyeccionDetComponent', () => {
  let component: VerInyeccionDetComponent;
  let fixture: ComponentFixture<VerInyeccionDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerInyeccionDetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerInyeccionDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
