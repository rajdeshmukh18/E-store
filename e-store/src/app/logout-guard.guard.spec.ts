import { TestBed } from '@angular/core/testing';

import { LogoutGuardGuard } from './logout-guard.guard';

describe('LogoutGuardGuard', () => {
  let guard: LogoutGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LogoutGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
