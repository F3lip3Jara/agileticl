import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTermoformadoComponent } from './ver-termoformado.component';

describe('VerTermoformadoComponent', () => {
  let component: VerTermoformadoComponent;
  let fixture: ComponentFixture<VerTermoformadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerTermoformadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerTermoformadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
