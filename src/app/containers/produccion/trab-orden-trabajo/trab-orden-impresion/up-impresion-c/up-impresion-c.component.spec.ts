import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpImpresionCComponent } from './up-impresion-c.component';

describe('UpImpresionCComponent', () => {
  let component: UpImpresionCComponent;
  let fixture: ComponentFixture<UpImpresionCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpImpresionCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpImpresionCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
