import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabStocksComponent } from './trab-stocks.component';

describe('TrabStocksComponent', () => {
  let component: TrabStocksComponent;
  let fixture: ComponentFixture<TrabStocksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabStocksComponent]
    });
    fixture = TestBed.createComponent(TrabStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
