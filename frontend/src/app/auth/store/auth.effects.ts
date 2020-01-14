import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, Effect } from "@ngrx/effects";
import * as AuthActions from "@app/auth/store/auth.actions";
import { concatMap, map, catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class AuthEffects {
  @Effect()
  authRegister = this.actions$.pipe(
    ofType(AuthActions.REGISTER_START),
    concatMap((registerData: AuthActions.RegisterStart) => {
      return this.http
        .post<any>("/auth/register", {
          email: registerData.payload.email,
          password: registerData.payload.password,
          confirmPassword: registerData.payload.confirmPassword,
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
        .post<any>("/auth/login", {
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
        .post<any>("/auth/logout", {})
        .pipe(map(() => new AuthActions.LogoutSuccess()));
    })
  );

  @Effect()
  refreshToken = this.actions$.pipe(
    ofType(AuthActions.REFRESH_ACCESS_TOKEN_START),
    concatMap(() => {
      return this.http
        .post<{ accessToken: string }>("/auth/refresh_token", {})
        .pipe(
          map(data => new AuthActions.RefreshToken(data)),
          catchError(data => {
            localStorage.removeItem("accessToken");
            sessionStorage.removeItem("accessToken");
            return of(new AuthActions.RefreshToken(data));
          })
        );
    })
  );

  @Effect()
  forgotPassword = this.actions$.pipe(
    ofType(AuthActions.FORGOT_PASSWORD_START),
    concatMap(({ email, url, httpType }) => {
      if(httpType == "patch") {
        return this.http
          .patch<any>(url, { email })
          .pipe(
            map(data => new AuthActions.ForgotPasswordSuccess(data)),
            catchError(({ error }) => of(new AuthActions.AuthFailed(error)))
          );
      } else {
        return this.http
          .post<any>(url, { email })
          .pipe(
            map(data => new AuthActions.ForgotPasswordSuccess(data)),
            catchError(({ error }) => of(new AuthActions.AuthFailed(error)))
          );
      }
    })
  );

  @Effect()
  resetPassword = this.actions$.pipe(
    ofType(AuthActions.RESET_PASSWORD_START),
    concatMap(({ resetPasswordToken, password }) => {
      return this.http
        .patch<any>("/auth/resetpassword", { resetPasswordToken, password })
        .pipe(
          map(data => {
            sessionStorage.removeItem("resetPasswordToken");
            return new AuthActions.ForgotPasswordSuccess(data);
          }),
          catchError(({ error }) => of(new AuthActions.AuthFailed(error)))
        );
    })
  );

  @Effect()
  removeLoggedUser = this.actions$.pipe(
    ofType(AuthActions.REMOVE_LOGGED_USER),
    concatMap(() => {
      return this.http.post<any>("/auth/removeloggeduser", {});
    })
  );

  @Effect()
  authActivateAccount = this.actions$.pipe(
    ofType(AuthActions.ACTIVATE_ACCOUNT_START),
    switchMap((activationData: AuthActions.ActivateAccountStart) => {
      return this.http
        .post<any>("/auth/activate-account", {
          activationToken: activationData.payload.activationToken
        })
        .pipe(
          map(resData => new AuthActions.ActivateAccountSuccess(resData)),
          catchError(({ error }) => of(new AuthActions.AuthFailed(error)))
        );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
