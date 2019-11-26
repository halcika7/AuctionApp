import * as ShopPageActions from "@app/shop-page/store/shop-page.actions";
import { Product } from '@app/landing-page/store/landing-page.reducers';

export interface Brand {
  id: string;
  name: string;
  number_of_products: string;
}

export interface Prices {
  avg_price?: string;
  max_price?: number;
  min_price?: number;
}

export interface FilterValues {
  id: string;
  name: string;
  Products: Product[]
}

export interface Filters {
  id: string;
  name: string;
  FilterValues: FilterValues[]
}

export interface State {
  products: Product[];
  brands: Brand[];
  prices: Prices;
  filters: Filters[];
  failedMessage: string;
}

const initialState: State = {
  products: [],
  brands: [],
  filters: [],
  prices: {},
  failedMessage: ""
};

export function shopPageReducer(
  state = initialState,
  action: ShopPageActions.ShopPageActions
) {
  switch (action.type) {
    case ShopPageActions.SHOP_PAGE_CLEAR:
      return {
        ...initialState
      };
    case ShopPageActions.SHOP_PAGE_SUCCESS:
      return {
        ...state,
        brands: action.payload.Brands ? action.payload.Brands : state.brands,
        prices: action.payload.prices ? action.payload.prices : state.prices,
        filters: action.payload.Filters ? action.payload.Filters : state.filters,
        products: action.payload.products ? action.payload.products : state.products
      };
    case ShopPageActions.SHOP_PAGE_FAILED:
      return {
        ...state,
        failedMessage: action.payload.failedMessage
      };
    default:
      return state;
  }
}
