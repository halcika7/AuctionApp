import { Action } from '@ngrx/store';

export const REGISTER_START = 'REGISTER_START';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILED = 'REGISTER_FAILED';
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

export class AuthClearMessagess implements Action {
  readonly type = AUTH_CLEAR_MESSAGESS;
}

export type AuthActions = RegisterStart | RegisterSuccess | RegisterFailed | AuthClearMessagess;
