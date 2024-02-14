import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabAccionesComponent } from './trab-acciones.component';

describe('TrabAccionesComponent', () => {
  let component: TrabAccionesComponent;
  let fixture: ComponentFixture<TrabAccionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabAccionesComponent]
    });
    fixture = TestBed.createComponent(TrabAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
