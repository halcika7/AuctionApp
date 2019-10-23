import { Action } from '@ngrx/store';

export const REGISTER_START = 'REGISTER_START';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILED = 'REGISTER_FAILED';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const LOGOUT_START = 'LOGOUT_START';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const REFRESH_ACCESS_TOKEN = 'REFRESH_ACCESS_TOKEN';
export const REFRESH_ACCESS_TOKEN_START = 'REFRESH_ACCESS_TOKEN_START';
export const AUTH_CLEAR_MESSAGESS = 'AUTH_CLEAR_MESSAGESS';

export class RegisterStart implements Action {
  readonly type = REGISTER_START;
  constructor(
    public payload: { firstName: string; lastName: string; email: string; password: string }
  ) {}
}

export class RegisterSuccess implements Action {
  readonly type = REGISTER_SUCCESS;
  constructor(public payload: { successMessage: string }) {}
}

export class RegisterFailed implements Action {
  readonly type = REGISTER_FAILED;
  constructor(public payload: { errors?: any; err?: string }) {}
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: { successMessage: string; accessToken: string }) {}
}

export class LoginFailed implements Action {
  readonly type = LOGIN_FAILED;
  constructor(public payload: { errors?: any; err?: string }) {}
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

export type AuthActions =
  | RegisterStart
  | RegisterSuccess
  | RegisterFailed
  | LoginStart
  | LoginSuccess
  | LoginFailed
  | LogoutStart
  | LogoutSuccess
  | RefreshToken
  | AuthClearMessagess;
