import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';

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
        const url = 'http://localhost:5000/api';
        const modifiedReq = req.clone({
          url: url + req.url,
          headers: req.headers.set('Authorization', 'Bearer ' + token),
          withCredentials: true
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
