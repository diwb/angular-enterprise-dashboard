import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ErrorNormalizerService } from './error-normalizer.service';

describe('ErrorNormalizerService', () => {
  let service: ErrorNormalizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorNormalizerService);
  });

  it('normalizes 401 responses with correlation id', () => {
    const error = new HttpErrorResponse({
      status: 401,
      error: { message: 'Token expired' },
      headers: new HttpHeaders({ 'x-correlation-id': 'corr-1' }),
    });

    expect(service.normalize(error)).toEqual({
      kind: 'unauthorized',
      status: 401,
      title: 'Session expired',
      message: 'Token expired',
      correlationId: 'corr-1',
    });
  });

  it('normalizes 403, validation, network and unexpected errors', () => {
    expect(service.normalize(new HttpErrorResponse({ status: 403 })).kind).toBe('forbidden');
    expect(
      service.normalize(
        new HttpErrorResponse({
          status: 422,
          error: { errors: { email: ['Invalid'] } },
        }),
      ),
    ).toMatchObject({ kind: 'validation', details: { email: ['Invalid'] } });
    expect(service.normalize(new HttpErrorResponse({ status: 0 })).kind).toBe('network');
    expect(service.normalize(new Error('Boom'))).toMatchObject({
      kind: 'unexpected',
      message: 'Boom',
    });
  });
});
