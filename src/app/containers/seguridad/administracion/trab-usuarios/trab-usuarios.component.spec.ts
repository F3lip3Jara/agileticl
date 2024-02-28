import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabUsuariosComponent } from './trab-usuarios.component';

describe('TrabUsuariosComponent', () => {
  let component: TrabUsuariosComponent;
  let fixture: ComponentFixture<TrabUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabUsuariosComponent]
    });
    fixture = TestBed.createComponent(TrabUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
