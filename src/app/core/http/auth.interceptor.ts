import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { APP_CONFIG } from '../config/app-config';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const config = inject(APP_CONFIG);
  const auth = inject(AuthService);
  const token = auth.session()?.accessToken;
  const isApiRequest = request.url.startsWith(config.apiBaseUrl) || request.url.startsWith('/api');

  if (!token || !isApiRequest) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Correlation-Id': crypto.randomUUID(),
      },
    }),
  );
};
