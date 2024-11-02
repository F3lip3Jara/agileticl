import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGeneralComponent } from './filtro-general.component';

describe('FiltroGeneralComponent', () => {
  let component: FiltroGeneralComponent;
  let fixture: ComponentFixture<FiltroGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltroGeneralComponent]
    });
    fixture = TestBed.createComponent(FiltroGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
