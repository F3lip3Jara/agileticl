import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsModuloOptComponent } from './ins-modulo-opt.component';

describe('InsModuloOptComponent', () => {
  let component: InsModuloOptComponent;
  let fixture: ComponentFixture<InsModuloOptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsModuloOptComponent]
    });
    fixture = TestBed.createComponent(InsModuloOptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
