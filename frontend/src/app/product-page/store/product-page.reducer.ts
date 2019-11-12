import * as ProductPageActions from './product-page.actions';
import { Product } from '@app/landing-page/store/landing-page.reducers';

export interface FullProduct extends Product {
  auctionStart: Date;
  auctionEnd: Date;
  userId: string;
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
  failedMessage: string;
  successMessage: string;
}

const initialState: State = {
  product: {
    id: '',
    name: '',
    details: '',
    picture: '',
    price: 0,
    auctionStart: null,
    auctionEnd: null,
    userId: '',
    subcategoryId: '',
    highest_bid: '',
    number_of_bids: '',
    ProductImages: []
  },
  similarProducts: [],
  error: '',
  bids: [],
  failedMessage: '',
  successMessage: ''
};

export function productPageReducer(
  state = initialState,
  action: ProductPageActions.ProductPageActions
) {
  switch (action.type) {
    case ProductPageActions.PRODUCT_START:
    case ProductPageActions.CLEAR_PRODUCT_STATE:
      return { ...initialState };
    case ProductPageActions.PRODUCT_SUCCESS:
      return {
        ...state,
        product: action.payload.product,
        bids: action.payload.bids ? action.payload.bids : []
      };
    case ProductPageActions.SIMILAR_PRODUCT_SUCCESS:
      return {
        ...state,
        similarProducts: action.payload.similarProducts
      };
    case ProductPageActions.PRODUCT_FAILED:
      return {
        ...initialState,
        error: action.payload.error.error ? action.payload.error.error : ''
      };
    case ProductPageActions.CLEAR_PRODUCT_MESSAGES:
      return {
        ...state,
        successMessage: '',
        failedMessage: ''
      };
    case ProductPageActions.PRODUCT_BID_SUCCESS:
      return {
        ...initialState,
        successMessage: action.payload.successMessage,
        failedMessage: '',
        product: {
          ...state.product,
          highest_bid: action.payload.highest_bid,
          number_of_bids:
            typeof state.product.number_of_bids === 'string'
              ? parseInt(state.product.number_of_bids) + 1
              : state.product.number_of_bids + 1
        },
        similarProducts: state.similarProducts
      };
    case ProductPageActions.PRODUCT_BID_FAILED:
      return {
        ...state,
        successMessage: '',
        failedMessage: action.payload.error.failedMessage
      };
    default:
      return state;
  }
}
