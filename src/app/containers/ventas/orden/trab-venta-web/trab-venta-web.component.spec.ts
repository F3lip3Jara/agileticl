import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabVentaWebComponent } from './trab-venta-web.component';

describe('TrabVentaWebComponent', () => {
  let component: TrabVentaWebComponent;
  let fixture: ComponentFixture<TrabVentaWebComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabVentaWebComponent]
    });
    fixture = TestBed.createComponent(TrabVentaWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
