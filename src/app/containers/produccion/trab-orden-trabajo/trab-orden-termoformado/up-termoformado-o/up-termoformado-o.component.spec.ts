import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpTermoformadoOComponent } from './up-termoformado-o.component';

describe('UpTermoformadoOComponent', () => {
  let component: UpTermoformadoOComponent;
  let fixture: ComponentFixture<UpTermoformadoOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpTermoformadoOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpTermoformadoOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
