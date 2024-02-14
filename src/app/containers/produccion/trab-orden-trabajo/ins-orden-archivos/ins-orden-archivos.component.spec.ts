import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsOrdenArchivosComponent } from './ins-orden-archivos.component';

describe('InsOrdenArchivosComponent', () => {
  let component: InsOrdenArchivosComponent;
  let fixture: ComponentFixture<InsOrdenArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsOrdenArchivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsOrdenArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
