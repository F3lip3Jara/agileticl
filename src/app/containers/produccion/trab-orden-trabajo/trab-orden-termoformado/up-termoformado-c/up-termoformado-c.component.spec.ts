import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpTermoformadoCComponent } from './up-termoformado-c.component';

describe('UpTermoformadoCComponent', () => {
  let component: UpTermoformadoCComponent;
  let fixture: ComponentFixture<UpTermoformadoCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpTermoformadoCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpTermoformadoCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
