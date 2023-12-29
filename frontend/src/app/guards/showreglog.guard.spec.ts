import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { showreglogGuard } from './showreglog.guard';

describe('showreglogGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => showreglogGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
