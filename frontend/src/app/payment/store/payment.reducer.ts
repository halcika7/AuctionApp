import * as PaymentPageActions from "./payemnt.actions";

export interface State {
  message: string;
  success: boolean;
}

const initialState: State = {
  message: "",
  success: false
};

export function paymentReducer(
  state = initialState,
  action: PaymentPageActions.PaymentPageActions
) {
  switch (action.type) {
    case PaymentPageActions.PAYMENT_PAGE_FAILED: {
      return {
        ...state,
        message: action.payload.message ? action.payload.message : '',
        success: false
      };
    }
    case PaymentPageActions.PAYMENT_PAGE_SUCCESS: {
      return {
        ...state,
        message: action.message ? action.message : '',
        success: action.message ? true : false
      };
    }
    case PaymentPageActions.CLEAR_PAYMENT_MESSAGES: {
      return {
        ...initialState
      };
    }
    default:
      return state;
  }
}
