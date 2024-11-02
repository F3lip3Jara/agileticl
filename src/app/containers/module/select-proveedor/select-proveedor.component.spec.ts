import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProveedorComponent } from './select-proveedor.component';

describe('SelectProveedorComponent', () => {
  let component: SelectProveedorComponent;
  let fixture: ComponentFixture<SelectProveedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectProveedorComponent]
    });
    fixture = TestBed.createComponent(SelectProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
