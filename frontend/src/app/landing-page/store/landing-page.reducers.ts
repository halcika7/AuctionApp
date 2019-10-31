import * as LandingPageActions from './landing-page.actions';

export interface Product {
  name: string;
  id: string;
  price: number;
  picture: string;
  details?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface State {
  featured: Product[];
  featuredCollections: Product[];
  newArrivals: Product[];
  topRated: Product[];
  lastChance: Product[];
  heroProduct: Product;
  categories: Category[];
  failedMessage: string;
}

const initialState: State = {
  featured: [],
  featuredCollections: [],
  newArrivals: [],
  topRated: [],
  lastChance: [],
  heroProduct: null,
  categories: [],
  failedMessage: ''
};

export function landingPageReducer(
  state = initialState,
  action: LandingPageActions.LandingPageActions
) {
  switch (action.type) {
    case LandingPageActions.LANDING_PAGE_SUCCESS:
      return {
        ...state,
        categories: action.payload.categories ? action.payload.categories : state.categories,
        featured: action.payload.featured ? action.payload.featured : state.featured,
        featuredCollections: action.payload.featuredCollections ? action.payload.featuredCollections : state.featuredCollections,
        newArrivals: action.payload.newArrivals ? action.payload.newArrivals : state.newArrivals,
        topRated: action.payload.topRated ? action.payload.topRated : state.topRated,
        lastChance: action.payload.lastChance ? action.payload.lastChance : state.lastChance,
        heroProduct: action.payload.heroProduct ? action.payload.heroProduct : state.heroProduct
      };
    case LandingPageActions.LANDING_PAGE_FAILED:
      return {
        ...state,
        failedMessage: action.payload.failedMessage
      };
    default:
      return state;
  }
}
