import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabEmbarquesComponent } from './trab-embarques.component';

describe('TrabEmbarquesComponent', () => {
  let component: TrabEmbarquesComponent;
  let fixture: ComponentFixture<TrabEmbarquesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrabEmbarquesComponent]
    });
    fixture = TestBed.createComponent(TrabEmbarquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
