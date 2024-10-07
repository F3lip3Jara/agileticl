import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabAlmacenComponent } from './trab-almacen.component';

describe('TrabAlmacenComponent', () => {
  let component: TrabAlmacenComponent;
  let fixture: ComponentFixture<TrabAlmacenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabAlmacenComponent]
    });
    fixture = TestBed.createComponent(TrabAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
