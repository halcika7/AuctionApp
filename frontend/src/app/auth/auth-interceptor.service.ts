import { AuthActions } from './store/auth.actions';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import { take, exhaustMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.accessToken;
      }),
      exhaustMap(token => {
        const modifiedReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token),
          withCredentials: true
        });
        return next.handle(modifiedReq);
        // .pipe(
        //   catchError((error: HttpErrorResponse) => {
        //     switch (error.status) {
        //       case 400:
        //         return this.handle400Error(error);
        //       case 401:
        //         return this.handle401Error(req, next);
        //       default:
        //         return throwError(error);
        //     }
        //   })
        // );
      })
    );
  }

  handle400Error(error) {
    // if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
    //   // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
    //   return this.logoutUser();
    // }
    // return observableThrowError(error);
    return throwError(error);
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return throwError('kdfopksdofk');
    // if (!this.isRefreshingToken) {
    //   this.isRefreshingToken = true;
    //   // Reset here so that the following requests wait until the token
    //   // comes back from the refreshToken call.
    //   this.tokenSubject.next(null);
    //   const authService = this.injector.get(AuthService);
    //   return authService.refreshToken().pipe(
    //     switchMap((newToken: string) => {
    //       if (newToken) {
    //         this.tokenSubject.next(newToken);
    //         return next.handle(this.addToken(this.getNewRequest(req), newToken));
    //       }
    //       // If we don't get a new token, we are in trouble so logout.
    //       return this.logoutUser();
    //     }),
    //     catchError(error => {
    //       // If there is an exception calling 'refreshToken', bad news so logout.
    //       return this.logoutUser();
    //     }),
    //     finalize(() => {
    //       this.isRefreshingToken = false;
    //     })
    //   );
    // } else {
    //   return this.tokenSubject.pipe(
    //     filter(token => token != null),
    //     take(1),
    //     switchMap(token => {
    //       return next.handle(this.addToken(this.getNewRequest(req), token));
    //     })
    //   );
    // }
  }
}
