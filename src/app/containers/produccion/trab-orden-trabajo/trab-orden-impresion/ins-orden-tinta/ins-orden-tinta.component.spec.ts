import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsOrdenTintaComponent } from './ins-orden-tinta.component';

describe('InsOrdenTintaComponent', () => {
  let component: InsOrdenTintaComponent;
  let fixture: ComponentFixture<InsOrdenTintaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsOrdenTintaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsOrdenTintaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
