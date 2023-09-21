import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsOrdenPesosComponent } from './ins-orden-pesos.component';

describe('InsOrdenPesosComponent', () => {
  let component: InsOrdenPesosComponent;
  let fixture: ComponentFixture<InsOrdenPesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsOrdenPesosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsOrdenPesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
