import { Action } from "@ngrx/store";

export const REGISTER_START = "REGISTER_START";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";

export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export const LOGOUT_START = "LOGOUT_START";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const REFRESH_ACCESS_TOKEN = "REFRESH_ACCESS_TOKEN";
export const REFRESH_ACCESS_TOKEN_START = "REFRESH_ACCESS_TOKEN_START";
export const AUTH_CLEAR_MESSAGESS = "AUTH_CLEAR_MESSAGESS";
export const AUTH_FAILED = "AUTH_FAILED";

export const RESET_TOKEN_EXPIRED = "RESET_TOKEN_EXPIRED";

export const FORGOT_PASSWORD_START = "FORGOT_PASSWORD_START";
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";

export const RESET_PASSWORD_START = "RESET_PASSWORD_START";
export const RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS";

export const REMOVE_LOGGED_USER = "REMOVE_LOGGED_USER";

export const ACTIVATE_ACCOUNT_START = "ACTIVATE_ACCOUNT_START";
export const ACTIVATE_ACCOUNT_SUCCESS = "ACTIVATE_ACCOUNT_SUCCESS";

export class RegisterStart implements Action {
  readonly type = REGISTER_START;
  constructor(
    public payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }
  ) {}
}

export class RegisterSuccess implements Action {
  readonly type = REGISTER_SUCCESS;
  constructor(public payload: { message: string }) {}
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(
    public payload: { email: string; password: string; remember: boolean }
  ) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(
    public payload: {
      message: string;
      accessToken: string;
      remember: boolean;
    }
  ) {}
}

export class LogoutStart implements Action {
  readonly type = LOGOUT_START;
}

export class LogoutSuccess implements Action {
  readonly type = LOGOUT_SUCCESS;
}

export class RefreshTokenStart implements Action {
  readonly type = REFRESH_ACCESS_TOKEN_START;
}

export class RefreshToken implements Action {
  readonly type = REFRESH_ACCESS_TOKEN;
  constructor(public payload: { accessToken: string }) {}
}

export class AuthClearMessagess implements Action {
  readonly type = AUTH_CLEAR_MESSAGESS;
}

export class AuthFailed implements Action {
  readonly type = AUTH_FAILED;
  constructor(public payload: { errors?: any; message?: string }) {}
}

export class ResetTokenExpired implements Action {
  readonly type = RESET_TOKEN_EXPIRED;
}

export class ForgotPasswordStart implements Action {
  readonly type = FORGOT_PASSWORD_START;
  constructor(public email: string, public url: string, public httpType: string) {}
}

export class ForgotPasswordSuccess implements Action {
  readonly type = FORGOT_PASSWORD_SUCCESS;
  constructor(public payload: { message: string }) {}
}

export class ResetPasswordStart implements Action {
  readonly type = RESET_PASSWORD_START;
  constructor(public resetPasswordToken: string, public password: string) {}
}

export class ResetPasswordSuccess implements Action {
  readonly type = RESET_PASSWORD_SUCCESS;
  constructor(public payload: { message: string }) {}
}

export class RemoveLoggedUser implements Action {
  readonly type = REMOVE_LOGGED_USER;
  constructor() {}
}

export class ActivateAccountStart implements Action {
  readonly type = ACTIVATE_ACCOUNT_START;
  constructor(public payload: { activationToken: string }) {}
}

export class ActivateAccountSuccess implements Action {
  readonly type = ACTIVATE_ACCOUNT_SUCCESS;
  constructor(public payload: { message: string }) {}
}

export type AuthActions =
  | ActivateAccountStart
  | ActivateAccountSuccess
  | RegisterStart
  | RegisterSuccess
  | LoginStart
  | LoginSuccess
  | LogoutStart
  | LogoutSuccess
  | RefreshTokenStart
  | RefreshToken
  | AuthClearMessagess
  | AuthFailed
  | ForgotPasswordStart
  | ForgotPasswordSuccess
  | ResetPasswordStart
  | ResetPasswordSuccess
  | RemoveLoggedUser
  | ResetTokenExpired;
