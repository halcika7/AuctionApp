import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  @Effect()
  authRegister = this.actions$.pipe(
    ofType(AuthActions.REGISTER_START),
    switchMap((registerData: AuthActions.RegisterStart) => {
      return this.http
        .post<any>('http://localhost:5000/api/auth/register', {
          email: registerData.payload.email,
          password: registerData.payload.password,
          firstName: registerData.payload.firstName,
          lastName: registerData.payload.lastName
        })
        .pipe(
          map(resData => new AuthActions.RegisterSuccess(resData)),
          catchError(({ error }) => of(new AuthActions.RegisterFailed(error)))
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((loginData: AuthActions.LoginStart) => {
      return this.http
        .post<any>('http://localhost:5000/api/auth/login', {
          email: loginData.payload.email,
          password: loginData.payload.password
        })
        .pipe(
          map(resData => new AuthActions.LoginSuccess(resData)),
          catchError(({ error }) => of(new AuthActions.LoginFailed(error)))
        );
    })
  );

  @Effect()
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT_START),
    switchMap(() => {
      return this.http.post<any>('http://localhost:5000/api/auth/logout', {}).pipe(
        map(data => new AuthActions.LogoutSuccess(data))
      );
    })
  );

  @Effect()
  refreshToken = this.actions$.pipe(
    ofType(AuthActions.REFRESH_ACCESS_TOKEN_START),
    switchMap((loginData: AuthActions.RefreshToken) => {
      return this.http
        .post<{ accessToken: string }>('http://localhost:5000/api/auth/refresh_token', {})
        .pipe(
          map(data => new AuthActions.RefreshToken(data)),
          catchError(data => of(new AuthActions.RefreshToken(data)))
        );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
