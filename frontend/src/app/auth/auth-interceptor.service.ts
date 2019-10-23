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
      })
    );
  }

}
