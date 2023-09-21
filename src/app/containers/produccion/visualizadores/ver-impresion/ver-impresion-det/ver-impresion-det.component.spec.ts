import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerImpresionDetComponent } from './ver-impresion-det.component';

describe('VerImpresionDetComponent', () => {
  let component: VerImpresionDetComponent;
  let fixture: ComponentFixture<VerImpresionDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerImpresionDetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerImpresionDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
