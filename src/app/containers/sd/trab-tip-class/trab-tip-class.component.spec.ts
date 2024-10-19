import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabTipClassComponent } from './trab-tip-class.component';

describe('TrabTipClassComponent', () => {
  let component: TrabTipClassComponent;
  let fixture: ComponentFixture<TrabTipClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabTipClassComponent]
    });
    fixture = TestBed.createComponent(TrabTipClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
