import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabOrdenEnvasadoComponent } from './trab-orden-envasado.component';

describe('TrabOrdenEnvasadoComponent', () => {
  let component: TrabOrdenEnvasadoComponent;
  let fixture: ComponentFixture<TrabOrdenEnvasadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabOrdenEnvasadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabOrdenEnvasadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
