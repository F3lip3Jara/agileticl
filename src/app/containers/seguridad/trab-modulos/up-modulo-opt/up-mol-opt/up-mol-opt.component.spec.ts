import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpMolOptComponent } from './up-mol-opt.component';

describe('UpMolOptComponent', () => {
  let component: UpMolOptComponent;
  let fixture: ComponentFixture<UpMolOptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpMolOptComponent]
    });
    fixture = TestBed.createComponent(UpMolOptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
