import * as AuthActions from "@app/auth/store/auth.actions";
import { jwtDecode } from "@app/shared/jwtDecode";

export interface State {
  errors: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  message: string;
  success: boolean;
  accessToken: string;
  remember: boolean;
  userId: string;
  resetTokenExpired: string;
  loading: boolean;
  finished: boolean;
}

const initialState: State = {
  errors: {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  },
  message: "",
  success: false,
  accessToken: "",
  remember: false,
  userId: "",
  resetTokenExpired: "",
  loading: false,
  finished: false
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  let id;
  switch (action.type) {
    case AuthActions.LOGOUT_START:
    case AuthActions.AUTH_CLEAR_MESSAGESS:
      return { ...initialState };
    case AuthActions.REGISTER_START:
    case AuthActions.REFRESH_ACCESS_TOKEN_START:
    case AuthActions.LOGIN_START:
      return {
        ...initialState,
        loading: true
      };
    case AuthActions.REGISTER_SUCCESS:
    case AuthActions.FORGOT_PASSWORD_SUCCESS:
    case AuthActions.RESET_PASSWORD_SUCCESS:
      return {
        ...initialState,
        message: action.payload.message,
        success: true,
        loading: false,
        finished: true
      };
    case AuthActions.LOGIN_SUCCESS:
      id = jwtDecode(action.payload.accessToken).id || "";
      return {
        ...initialState,
        accessToken: action.payload.accessToken
          ? action.payload.accessToken
          : "",
        message: action.payload.message,
        remember: action.payload.remember,
        userId: id,
        success: true,
        loading: false
      };
    case AuthActions.REFRESH_ACCESS_TOKEN:
      id = jwtDecode(action.payload.accessToken).id || "";
      return {
        ...initialState,
        accessToken: action.payload.accessToken,
        userId: id,
        loading: false
      };
    case AuthActions.RESET_TOKEN_EXPIRED: {
      return {
        ...initialState,
        resetTokenExpired: "Reset password token expired"
      };
    }
    case AuthActions.AUTH_FAILED:
      return {
        ...initialState,
        errors: action.payload.errors ? action.payload.errors : state.errors,
        message: action.payload.message
          ? action.payload.message
          : state.message,
        success: false,
        loading: false,
        finished: true
      };
    case AuthActions.LOGOUT_SUCCESS: {
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      return {
        ...initialState
      };
    }
    default:
      return state;
  }
}
