import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsEnvasadoComponent } from './ins-envasado.component';

describe('InsEnvasadoComponent', () => {
  let component: InsEnvasadoComponent;
  let fixture: ComponentFixture<InsEnvasadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsEnvasadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsEnvasadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
