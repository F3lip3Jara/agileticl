import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTermoformadoDetComponent } from './ver-termoformado-det.component';

describe('VerTermoformadoDetComponent', () => {
  let component: VerTermoformadoDetComponent;
  let fixture: ComponentFixture<VerTermoformadoDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerTermoformadoDetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerTermoformadoDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
