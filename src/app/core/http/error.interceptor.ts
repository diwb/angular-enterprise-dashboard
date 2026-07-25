import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ErrorNormalizerService } from '../errors/error-normalizer.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const normalizer = inject(ErrorNormalizerService);

  return next(request).pipe(
    catchError((error: unknown) => {
      const normalized = normalizer.normalize(error);
      if (error instanceof HttpErrorResponse && error.status === 401) {
        auth.logout();
      }
      return throwError(() => normalized);
    }),
  );
};
