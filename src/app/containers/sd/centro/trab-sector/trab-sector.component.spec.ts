import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabSectorComponent } from './trab-sector.component';

describe('TrabSectorComponent', () => {
  let component: TrabSectorComponent;
  let fixture: ComponentFixture<TrabSectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabSectorComponent]
    });
    fixture = TestBed.createComponent(TrabSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
