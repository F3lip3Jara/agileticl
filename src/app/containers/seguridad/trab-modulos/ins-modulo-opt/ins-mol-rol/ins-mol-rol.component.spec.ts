import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsMolRolComponent } from './ins-mol-rol.component';

describe('InsMolRolComponent', () => {
  let component: InsMolRolComponent;
  let fixture: ComponentFixture<InsMolRolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsMolRolComponent]
    });
    fixture = TestBed.createComponent(InsMolRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
