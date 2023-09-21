import { TestBed } from '@angular/core/testing';

import { InicioSessionGuard } from './inicio-session.guard';

describe('InicioSessionGuard', () => {
  let guard: InicioSessionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InicioSessionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
