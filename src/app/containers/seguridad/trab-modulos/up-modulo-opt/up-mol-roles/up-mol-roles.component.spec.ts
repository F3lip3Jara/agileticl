import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpMolRolesComponent } from './up-mol-roles.component';

describe('UpMolRolesComponent', () => {
  let component: UpMolRolesComponent;
  let fixture: ComponentFixture<UpMolRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpMolRolesComponent]
    });
    fixture = TestBed.createComponent(UpMolRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
