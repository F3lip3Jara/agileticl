import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoOrdenProduccionComponent } from './info-orden-produccion.component';

describe('InfoOrdenProduccionComponent', () => {
  let component: InfoOrdenProduccionComponent;
  let fixture: ComponentFixture<InfoOrdenProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoOrdenProduccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoOrdenProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
