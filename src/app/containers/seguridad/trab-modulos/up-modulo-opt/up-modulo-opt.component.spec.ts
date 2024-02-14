import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpModuloOptComponent } from './up-modulo-opt.component';

describe('UpModuloOptComponent', () => {
  let component: UpModuloOptComponent;
  let fixture: ComponentFixture<UpModuloOptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpModuloOptComponent]
    });
    fixture = TestBed.createComponent(UpModuloOptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
