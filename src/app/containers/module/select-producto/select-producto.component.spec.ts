import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProductoComponent } from './select-producto.component';

describe('SelectProductoComponent', () => {
  let component: SelectProductoComponent;
  let fixture: ComponentFixture<SelectProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectProductoComponent]
    });
    fixture = TestBed.createComponent(SelectProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
