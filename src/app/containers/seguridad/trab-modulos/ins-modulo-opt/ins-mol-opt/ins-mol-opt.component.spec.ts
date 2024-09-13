import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsMolOptComponent } from './ins-mol-opt.component';

describe('InsMolOptComponent', () => {
  let component: InsMolOptComponent;
  let fixture: ComponentFixture<InsMolOptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsMolOptComponent]
    });
    fixture = TestBed.createComponent(InsMolOptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
