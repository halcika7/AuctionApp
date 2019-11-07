import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from '@app/auth/store/auth.actions';
import { concatMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  @Effect()
  authRegister = this.actions$.pipe(
    ofType(AuthActions.REGISTER_START),
    concatMap((registerData: AuthActions.RegisterStart) => {
      return this.http
        .post<any>('/auth/register', {
          email: registerData.payload.email,
          password: registerData.payload.password,
          firstName: registerData.payload.firstName,
          lastName: registerData.payload.lastName
        })
        .pipe(
          map(resData => new AuthActions.RegisterSuccess(resData)),
          catchError(({ error }) => of(new AuthActions.AuthFailed(error)))
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    concatMap((loginData: AuthActions.LoginStart) => {
      return this.http
        .post<any>('/auth/login', {
          email: loginData.payload.email,
          password: loginData.payload.password,
          remember: loginData.payload.remember
        })
        .pipe(
          map(resData => new AuthActions.LoginSuccess(resData)),
          catchError(({ error }) => of(new AuthActions.AuthFailed(error)))
        );
    })
  );

  @Effect()
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT_START),
    concatMap(() => {
      return this.http
        .post<any>('/auth/logout', {})
        .pipe(map(() => new AuthActions.LogoutSuccess()));
    })
  );

  @Effect()
  refreshToken = this.actions$.pipe(
    ofType(AuthActions.REFRESH_ACCESS_TOKEN_START),
    concatMap(() => {
      return this.http.post<{ accessToken: string }>('/auth/refresh_token', {}).pipe(
        map(data => new AuthActions.RefreshToken(data)),
        catchError(data => {
          localStorage.removeItem('accessToken');
          sessionStorage.removeItem('accessToken');
          return of(new AuthActions.RefreshToken(data));
        })
      );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
