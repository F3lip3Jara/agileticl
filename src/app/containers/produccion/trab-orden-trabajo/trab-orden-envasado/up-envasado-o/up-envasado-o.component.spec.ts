import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpEnvasadoOComponent } from './up-envasado-o.component';

describe('UpEnvasadoOComponent', () => {
  let component: UpEnvasadoOComponent;
  let fixture: ComponentFixture<UpEnvasadoOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpEnvasadoOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpEnvasadoOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
