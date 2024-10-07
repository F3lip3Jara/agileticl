import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabTipPagoComponent } from './trab-tip-pago.component';

describe('TrabTipPagoComponent', () => {
  let component: TrabTipPagoComponent;
  let fixture: ComponentFixture<TrabTipPagoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabTipPagoComponent]
    });
    fixture = TestBed.createComponent(TrabTipPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
