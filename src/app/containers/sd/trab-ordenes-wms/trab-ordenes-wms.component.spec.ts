import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabOrdenesWmsComponent } from './trab-ordenes-wms.component';

describe('TrabOrdenesWmsComponent', () => {
  let component: TrabOrdenesWmsComponent;
  let fixture: ComponentFixture<TrabOrdenesWmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabOrdenesWmsComponent]
    });
    fixture = TestBed.createComponent(TrabOrdenesWmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
