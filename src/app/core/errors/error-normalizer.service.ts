import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type AppErrorKind =
  'unauthorized' | 'forbidden' | 'not-found' | 'validation' | 'network' | 'unexpected';

export interface AppError {
  kind: AppErrorKind;
  status: number;
  title: string;
  message: string;
  correlationId?: string;
  details?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class ErrorNormalizerService {
  normalize(error: unknown): AppError {
    if (error instanceof HttpErrorResponse) {
      return this.fromHttp(error);
    }

    if (error instanceof Error) {
      return {
        kind: 'unexpected',
        status: 0,
        title: 'Unexpected error',
        message: error.message || 'An unexpected error occurred.',
      };
    }

    return {
      kind: 'unexpected',
      status: 0,
      title: 'Unexpected error',
      message: 'An unexpected error occurred.',
    };
  }

  private fromHttp(error: HttpErrorResponse): AppError {
    const correlationId = error.headers.get('x-correlation-id') ?? undefined;
    const apiMessage = this.extractMessage(error.error);

    if (error.status === 0) {
      return {
        kind: 'network',
        status: 0,
        title: 'Network unavailable',
        message: 'The service could not be reached. Check your connection and try again.',
        correlationId,
      };
    }

    if (error.status === 401) {
      return {
        kind: 'unauthorized',
        status: 401,
        title: 'Session expired',
        message: apiMessage ?? 'Your session expired. Sign in again to continue.',
        correlationId,
      };
    }

    if (error.status === 403) {
      return {
        kind: 'forbidden',
        status: 403,
        title: 'Access denied',
        message: apiMessage ?? 'Your role does not allow this action.',
        correlationId,
      };
    }

    if (error.status === 404) {
      return {
        kind: 'not-found',
        status: 404,
        title: 'Not found',
        message: apiMessage ?? 'The requested resource was not found.',
        correlationId,
      };
    }

    if (error.status === 400 || error.status === 422) {
      return {
        kind: 'validation',
        status: error.status,
        title: 'Validation failed',
        message: apiMessage ?? 'Review the highlighted fields and try again.',
        correlationId,
        details: this.extractDetails(error.error),
      };
    }

    return {
      kind: 'unexpected',
      status: error.status,
      title: 'Unexpected service error',
      message: apiMessage ?? 'The service returned an unexpected error.',
      correlationId,
    };
  }

  private extractMessage(payload: unknown): string | undefined {
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (!payload || typeof payload !== 'object') return undefined;
    if ('message' in payload && typeof payload.message === 'string') return payload.message;
    if ('title' in payload && typeof payload.title === 'string') return payload.title;
    return undefined;
  }

  private extractDetails(payload: unknown): Record<string, unknown> | undefined {
    if (!payload || typeof payload !== 'object') return undefined;
    if ('errors' in payload && payload.errors && typeof payload.errors === 'object') {
      return payload.errors as Record<string, unknown>;
    }
    return undefined;
  }
}
