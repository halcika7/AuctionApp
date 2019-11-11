import * as ProductPageActions from './product-page.actions';
import { Product } from './../../landing-page/store/landing-page.reducers';

export interface FullProduct extends Product {
  auctionStart: Date;
  auctionEnd: Date;
  userId: string;
  subcategoryId: string;
  highest_bid: string | number;
  number_of_bids: string;
  ProductImages: { image: string }[] | [];
}

export interface State {
  product: FullProduct;
  similarProducts: Product[];
  error: string;
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
  error: ''
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
        ...initialState,
        product: action.payload.product,
        similarProducts: action.payload.similarProducts
      };
    case ProductPageActions.PRODUCT_FAILED:
      return {
        ...initialState,
        error: action.payload.error.error ? action.payload.error.error : ''
      };
    default:
      return state;
  }
}
