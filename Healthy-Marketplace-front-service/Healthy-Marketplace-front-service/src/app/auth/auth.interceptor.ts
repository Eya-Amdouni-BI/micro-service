import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private keycloak: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.keycloak.updateToken(60)).pipe(
      switchMap(() => from(this.keycloak.getToken())),
      switchMap(token => {
        console.log('Token retrieved in interceptor:', token);
        console.log('Original request URL:', req.url);
        console.log('Original request headers:', req.headers.keys());
        console.log('Original request body:', req.body);
        console.log('Original request method:', req.method);
        if (token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(cloned);
        }

        return next.handle(req);
      }),
      catchError(err => {
        console.error('Keycloak token refresh failed:', err);
        return next.handle(req);
      })
    );
  }
}