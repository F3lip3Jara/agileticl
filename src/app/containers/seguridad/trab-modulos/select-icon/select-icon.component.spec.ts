import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIconComponent } from './select-icon.component';

describe('SelectIconComponent', () => {
  let component: SelectIconComponent;
  let fixture: ComponentFixture<SelectIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectIconComponent]
    });
    fixture = TestBed.createComponent(SelectIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
