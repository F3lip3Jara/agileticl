import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabEquivalenciaComponent } from './trab-equivalencia.component';

describe('TrabEquivalenciaComponent', () => {
  let component: TrabEquivalenciaComponent;
  let fixture: ComponentFixture<TrabEquivalenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabEquivalenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabEquivalenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
