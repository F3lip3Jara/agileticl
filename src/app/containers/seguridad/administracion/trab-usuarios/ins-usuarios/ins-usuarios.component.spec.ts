import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsUsuariosComponent } from './ins-usuarios.component';

describe('InsUsuariosComponent', () => {
  let component: InsUsuariosComponent;
  let fixture: ComponentFixture<InsUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsUsuariosComponent]
    });
    fixture = TestBed.createComponent(InsUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
