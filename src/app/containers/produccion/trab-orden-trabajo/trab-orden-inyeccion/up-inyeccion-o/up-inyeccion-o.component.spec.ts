import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpInyeccionOComponent } from './up-inyeccion-o.component';

describe('UpInyeccionOComponent', () => {
  let component: UpInyeccionOComponent;
  let fixture: ComponentFixture<UpInyeccionOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpInyeccionOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpInyeccionOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
