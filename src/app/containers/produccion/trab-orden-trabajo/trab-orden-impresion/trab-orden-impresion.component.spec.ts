import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabOrdenImpresionComponent } from './trab-orden-impresion.component';

describe('TrabOrdenImpresionComponent', () => {
  let component: TrabOrdenImpresionComponent;
  let fixture: ComponentFixture<TrabOrdenImpresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabOrdenImpresionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabOrdenImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
