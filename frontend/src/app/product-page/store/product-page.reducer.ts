import * as ProductPageActions from "./product-page.actions";
import { Product } from "@app/landing-page/store/landing-page.reducers";

export interface FullProduct extends Product {
  auctionStart: Date;
  auctionEnd: Date;
  highest_bid: string | number;
  number_of_bids: string | number;
  ProductImages: { image: string }[] | [];
}

export interface Bid {
  dateBid: Date;
  price: number;
  User: { firstName: string; lastName: string; photo: string };
}

export interface State {
  product: FullProduct;
  similarProducts: Product[];
  error: string;
  bids: Bid[];
  message: string;
  success: boolean;
  numberOfViewers: { views?: number; productId?: string };
}

const initialState: State = {
  product: {
    id: "",
    name: "",
    details: "",
    picture: "",
    price: 0,
    auctionStart: null,
    auctionEnd: null,
    userId: "",
    subcategoryId: "",
    highest_bid: "",
    number_of_bids: "",
    ProductImages: []
  },
  similarProducts: [],
  error: "",
  bids: [],
  message: "",
  success: false,
  numberOfViewers: { views: 0, productId: null }
};

export function productPageReducer(
  state = initialState,
  action: ProductPageActions.ProductPageActions
) {
  switch (action.type) {
    case ProductPageActions.PRODUCT_START:
      return {
        ...initialState,
        message:
          state.message === "Please login in order to place bid!"
            ? state.message
            : ""
      };
    case ProductPageActions.PRODUCT_SUCCESS:
      return {
        ...state,
        product: action.payload.product,
        bids: action.payload.bids ? action.payload.bids : [],
        message: action.payload.message
          ? action.payload.message
          : state.message,
        success: action.payload.message ? false : state.success
      };
    case ProductPageActions.SIMILAR_PRODUCT_SUCCESS:
      return {
        ...state,
        similarProducts: action.payload.similarProducts
      };
    case ProductPageActions.PRODUCT_FAILED:
      return {
        ...initialState,
        error: action.payload.error.error ? action.payload.error.error : ""
      };
    case ProductPageActions.CLEAR_PRODUCT_MESSAGES:
      return {
        ...state,
        message: "",
        success: false
      };
    case ProductPageActions.PRODUCT_BID_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        success: true
      };
    case ProductPageActions.PRODUCT_SET_MESSAGE:
      return {
        ...state,
        message: action.message,
        success: false
      };
    case ProductPageActions.PRODUCT_BID_FAILED:
      return {
        ...state,
        message: action.payload.error.message
          ? action.payload.error.message
          : "Please login in order to place bid!",
        success: false
      };
    case ProductPageActions.SET_NUMBER_OF_VIEWERS: {
      return {
        ...state,
        numberOfViewers: action.payload
      };
    }
    default:
      return state;
  }
}
