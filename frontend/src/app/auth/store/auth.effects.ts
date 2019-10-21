import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
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

  constructor(private actions$: Actions, private http: HttpClient) {}
}
