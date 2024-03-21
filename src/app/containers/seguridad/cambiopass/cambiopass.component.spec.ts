import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiopassComponent } from './cambiopass.component';

describe('CambiopassComponent', () => {
  let component: CambiopassComponent;
  let fixture: ComponentFixture<CambiopassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambiopassComponent]
    });
    fixture = TestBed.createComponent(CambiopassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
