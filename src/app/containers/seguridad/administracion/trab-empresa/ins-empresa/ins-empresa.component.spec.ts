import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsEmpresaComponent } from './ins-empresa.component';

describe('InsEmpresaComponent', () => {
  let component: InsEmpresaComponent;
  let fixture: ComponentFixture<InsEmpresaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsEmpresaComponent]
    });
    fixture = TestBed.createComponent(InsEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
