import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabCentroComponent } from './trab-centro.component';

describe('TrabCentroComponent', () => {
  let component: TrabCentroComponent;
  let fixture: ComponentFixture<TrabCentroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabCentroComponent]
    });
    fixture = TestBed.createComponent(TrabCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
