import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsImpresionComponent } from './ins-impresion.component';

describe('InsImpresionComponent', () => {
  let component: InsImpresionComponent;
  let fixture: ComponentFixture<InsImpresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsImpresionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
