import * as AuthActions from './auth.actions';

export interface State {
  isAuthenticated: boolean;
  errors: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  errorMessage: string;
  successMessage: string;
}

const initialState: State = {
  isAuthenticated: false,
  errors: {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  },
  errorMessage: '',
  successMessage: ''
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.REGISTER_START:
      return { ...initialState };
    case AuthActions.REGISTER_SUCCESS:
      return {
        ...initialState,
        successMessage: action.payload.successMessage
      };
    case AuthActions.REGISTER_FAILED:
      return {
        ...initialState,
        errors: action.payload.errors ? action.payload.errors : state.errors,
        errorMessage: action.payload.err ? action.payload.err : state.errorMessage
      };
    case AuthActions.AUTH_CLEAR_MESSAGESS:
      return {
        ...state,
        errorMessage: '',
        successMessage: ''
      };
    default:
      return state;
  }
}
