import * as PaymentPageActions from "./payemnt.actions";
import { OwnerInfo } from '@app/product-page/store/product-page.reducer';

export interface State {
  message: string;
  success: boolean;
  ownerInfo: OwnerInfo;
  previousRating: number;
}

const initialState: State = {
  message: "",
  success: false,
  ownerInfo: {
    photo: '',
    full_name: '',
    avg_rating: ''
  },
  previousRating: null
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
        message: action.payload.message ? action.payload.message : '',
        ownerInfo: action.payload.ownerInfo ? action.payload.ownerInfo : state.ownerInfo,
        previousRating: action.payload.rating ? action.payload.rating : state.previousRating,
        success: action.payload.message ? true : false
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
