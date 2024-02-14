import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpInyeccionCComponent } from './up-inyeccion-c.component';

describe('UpInyeccionCComponent', () => {
  let component: UpInyeccionCComponent;
  let fixture: ComponentFixture<UpInyeccionCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpInyeccionCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpInyeccionCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
