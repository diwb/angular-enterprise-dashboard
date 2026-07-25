import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { authGuard, permissionGuard } from './auth.guard';

describe('auth guards', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('redirects anonymous users to login', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result.toString()).toContain('/login');
  });

  it('allows authenticated users', async () => {
    await TestBed.inject(AuthService).login('admin@example.com');
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toBe(true);
  });

  it('enforces permission-based access', async () => {
    await TestBed.inject(AuthService).login('analyst@example.com');
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard('users:read')({} as never, {} as never),
    );

    expect(result.toString()).toContain('/403');
  });

  it('allows users with required permission', async () => {
    await TestBed.inject(AuthService).login('admin@example.com');
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard('users:read')({} as never, {} as never),
    );
    expect(result).toBe(true);
    expect(TestBed.inject(Router)).toBeTruthy();
  });
});
