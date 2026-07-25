import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('creates a demo session for a known user', async () => {
    const service = TestBed.inject(AuthService);
    const session = await service.login('admin@example.com');
    expect(session.user.role).toBe('Admin');
    expect(service.isAuthenticated()).toBe(true);
    expect(service.can('users:read')).toBe(true);
  });

  it('rejects unknown demo credentials', async () => {
    const service = TestBed.inject(AuthService);
    await expect(service.login('unknown@example.com')).rejects.toThrow();
  });

  it('restores and clears a stored session', async () => {
    const service = TestBed.inject(AuthService);
    await service.login('manager@example.com');

    const restored = TestBed.inject(AuthService);
    expect(restored.user()?.email).toBe('manager@example.com');

    restored.logout();
    expect(restored.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('aed.session')).toBeNull();
  });

  it('reports permissions and role labels by user role', async () => {
    const service = TestBed.inject(AuthService);
    await service.login('analyst@example.com');

    expect(service.can('payments:read')).toBe(true);
    expect(service.can('users:read')).toBe(false);
    expect(service.roleLabel()).toBe('Analyst');
  });
});
