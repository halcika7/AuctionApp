import * as AuthActions from './auth.actions';

export interface State {
  errors: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  errorMessage: string;
  successMessage: string;
  accessToken: string;
  remember: boolean;
}

const initialState: State = {
  errors: {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  },
  errorMessage: '',
  successMessage: '',
  accessToken: '',
  remember: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.REGISTER_START:
    case AuthActions.LOGOUT_START:
    case AuthActions.AUTH_CLEAR_MESSAGESS:
      return { ...initialState };
    case AuthActions.REGISTER_SUCCESS:
      return {
        ...initialState,
        successMessage: action.payload.successMessage
      };
    case AuthActions.REGISTER_FAILED:
    case AuthActions.LOGIN_FAILED:
      return {
        ...initialState,
        errors: action.payload.errors ? action.payload.errors : state.errors,
        errorMessage: action.payload.err ? action.payload.err : state.errorMessage
      };
    case AuthActions.LOGIN_SUCCESS:
      return {
        ...initialState,
        accessToken: action.payload.accessToken ? action.payload.accessToken : '',
        successMessage: action.payload.successMessage,
        remember: action.payload.remember
      };
    case AuthActions.REFRESH_ACCESS_TOKEN:
      return {
        ...initialState,
        accessToken: action.payload.accessToken
      };
    default:
      return state;
  }
}
