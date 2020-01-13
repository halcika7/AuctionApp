import * as ProfileActions from "./profile.actions";
import { Product } from "@app/landing-page/store/landing-page.reducers";

export interface ProfileProduct extends Product {
  highest_bid: string | number;
  number_of_bids: string | number;
  status: string;
  auctionEnd: string;
}

export interface UserInfo {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
  gender?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  hasCard?: boolean;
  OptionalInfo?: {
    street: string | null;
    city: string | null;
    zip: string | null;
    state: string | null;
    country: string | null;
  };
  CardInfo?: {
    name: string | null;
    number: string | null;
    cvc: string | null;
    exp_year: number | null;
    exp_month: string | null;
  };
}

export interface ProfileBid {
  createdAt: string;
  price: number;
  Product: ProfileProduct;
}

export interface State {
  userInfo: UserInfo;
  products: ProfileProduct[];
  bids: ProfileBid[];
  noMore: boolean;
  errors: any;
  message: string;
  success: boolean;
  auctionWonMessage: string;
}

const initialState: State = {
  userInfo: {},
  products: [],
  bids: [],
  noMore: false,
  errors: {},
  message: "",
  success: false,
  auctionWonMessage: ''
};

export function profileReducer(
  state = initialState,
  action: ProfileActions.ProfileActions
) {
  switch (action.type) {
    case ProfileActions.CLEAR_PROFILE: {
      return { ...initialState };
    }
    case ProfileActions.PROFILE_SUCCESS: {
      return {
        ...state,
        userInfo: action.payload.userInfo
          ? action.payload.userInfo
          : state.userInfo,
        products: action.payload.products
          ? action.payload.products
          : state.products,
        bids: action.payload.bids ? action.payload.bids : state.bids,
        noMore: action.payload.noMore ? action.payload.noMore : false
      };
    }
    case ProfileActions.LOAD_MORE_PROFILE_SUCCESS: {
      return {
        ...state,
        products: action.payload.products
          ? [...state.products, ...action.payload.products]
          : state.products,
        bids: action.payload.bids
          ? [...state.bids, ...action.payload.bids]
          : state.bids,
        noMore: action.payload.noMore
      };
    }
    case ProfileActions.PROFILE_FAILED: {
      return {
        ...state,
        message: action.payload.message ? action.payload.message : '',
        success: false
      }
    }
    case ProfileActions.UPDATE_PROFILE_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        userInfo: action.payload.userInfo,
        errors: {},
        success: true
      };
    }
    case ProfileActions.UPDATE_PROFILE_FAILED: {
      return {
        ...state,
        message: action.payload.failedMessage ? action.payload.failedMessage : "",
        errors: action.payload.errors ? action.payload.errors : {},
        success: false
      };
    }
    case ProfileActions.CLEAR_PROFILE_MESSAGES: {
      return {
        ...state,
        message: '',
        success: false,
        auctionWonMessage: action.clearAuctionWonMessage ? "" : state.auctionWonMessage
      }
    }
    case ProfileActions.SET_AUCTION_WON_MESSAGE: {
      const bids = [...state.bids].map(bid => {
        if(bid.Product.id === action.productId) {
          bid.Product.status = 'closed';
        }

        return bid;
      })
      return {
        ...state,
        auctionWonMessage: action.message,
        bids
      }
    }
    default:
      return state;
  }
}
