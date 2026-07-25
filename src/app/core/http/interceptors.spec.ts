import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { authInterceptor } from './auth.interceptor';
import { errorInterceptor } from './error.interceptor';

describe('HTTP interceptors', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('adds auth and correlation headers to API requests', async () => {
    await auth.login('admin@example.com');
    http.get('/api/customers').subscribe();

    const request = controller.expectOne('/api/customers');
    expect(request.request.headers.get('Authorization')).toBe('Bearer demo-token-u-admin');
    expect(request.request.headers.get('X-Correlation-Id')).toBeTruthy();
    request.flush([]);
  });

  it('does not add auth headers to external requests', async () => {
    await auth.login('admin@example.com');
    http.get('https://example.com/status').subscribe();

    const request = controller.expectOne('https://example.com/status');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('normalizes 403 responses without clearing the session', async () => {
    await auth.login('admin@example.com');
    const errors: unknown[] = [];
    http.get('/api/admin').subscribe({ error: (error) => errors.push(error) });

    controller
      .expectOne('/api/admin')
      .flush({ message: 'Nope' }, { status: 403, statusText: 'Forbidden' });

    expect(errors[0]).toMatchObject({ kind: 'forbidden', message: 'Nope' });
    expect(auth.isAuthenticated()).toBe(true);
  });

  it('normalizes 401 responses and logs out', async () => {
    await auth.login('admin@example.com');
    const errors: unknown[] = [];
    http.get('/api/session').subscribe({ error: (error) => errors.push(error) });

    controller.expectOne('/api/session').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(errors[0]).toMatchObject({ kind: 'unauthorized' });
    expect(auth.isAuthenticated()).toBe(false);
  });
});
