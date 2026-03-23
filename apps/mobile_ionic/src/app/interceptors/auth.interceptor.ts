import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  return from(authService.getAccessToken()).pipe(
    switchMap((token) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status !== 401) {
            return throwError(() => error);
          }
          return from(authService.getRefreshToken()).pipe(
            switchMap((refreshToken) => {
              if (!refreshToken) {
                return throwError(() => error);
              }
              return authService.refresh(refreshToken).pipe(
                switchMap((data) =>
                  from(authService.setTokens(data.accessToken, data.refreshToken)).pipe(
                    switchMap(() => {
                      const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${data.accessToken}` } });
                      return next(retryReq);
                    })
                  )
                )
              );
            })
          );
        })
      );
    })
  );
};
