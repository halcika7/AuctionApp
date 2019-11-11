import * as AuthActions from '@app/auth/store/auth.actions';
import { jwtDecode } from '@app/shared/jwtDecode';

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
  loading: boolean;
  userId: string;
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
  remember: false,
  loading: false,
  userId: ''
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  let id;
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
    case AuthActions.AUTH_FAILED:
      return {
        ...initialState,
        errors: action.payload.errors ? action.payload.errors : state.errors,
        errorMessage: action.payload.err ? action.payload.err : state.errorMessage
      };
    case AuthActions.LOGIN_SUCCESS:
      id = jwtDecode(action.payload.accessToken);
      return {
        ...initialState,
        accessToken: action.payload.accessToken ? action.payload.accessToken : '',
        successMessage: action.payload.successMessage,
        remember: action.payload.remember,
        loading: false,
        userId: id
      };
    case AuthActions.REFRESH_ACCESS_TOKEN_START:
    case AuthActions.LOGIN_START:
      return {
        ...initialState,
        loading: true
      };
    case AuthActions.REFRESH_ACCESS_TOKEN:
      id = jwtDecode(action.payload.accessToken);
      return {
        ...initialState,
        accessToken: action.payload.accessToken,
        loading: false,
        userId: id
      };
    default:
      return state;
  }
}
