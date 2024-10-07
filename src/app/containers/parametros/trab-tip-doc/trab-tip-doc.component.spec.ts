import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabTipDocComponent } from './trab-tip-doc.component';

describe('TrabTipDocComponent', () => {
  let component: TrabTipDocComponent;
  let fixture: ComponentFixture<TrabTipDocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabTipDocComponent]
    });
    fixture = TestBed.createComponent(TrabTipDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
