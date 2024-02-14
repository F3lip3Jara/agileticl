import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpImpresionOComponent } from './up-impresion-o.component';

describe('UpImpresionOComponent', () => {
  let component: UpImpresionOComponent;
  let fixture: ComponentFixture<UpImpresionOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpImpresionOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpImpresionOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
