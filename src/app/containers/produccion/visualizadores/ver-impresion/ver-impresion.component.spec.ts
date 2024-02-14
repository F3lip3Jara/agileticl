import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerImpresionComponent } from './ver-impresion.component';

describe('VerImpresionComponent', () => {
  let component: VerImpresionComponent;
  let fixture: ComponentFixture<VerImpresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerImpresionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
