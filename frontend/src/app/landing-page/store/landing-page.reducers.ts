import * as LandingPageActions from '@app/landing-page/store/landing-page.actions';

export interface Product {
  name: string;
  id: string;
  price: number;
  picture: string;
  subcategoryId?: string;
  details?: string;
}

export interface State {
  featured: Product[];
  featuredCollections: Product[];
  newArrivals: Product[];
  topRated: Product[];
  lastChance: Product[];
  heroProduct: Product;
  failedMessage: string;
  noMore: boolean;
}

const initialState: State = {
  featured: [],
  featuredCollections: [],
  newArrivals: [],
  topRated: [],
  lastChance: [],
  heroProduct: null,
  failedMessage: '',
  noMore: false
};

export function landingPageReducer(
  state = initialState,
  action: LandingPageActions.LandingPageActions
) {
  switch (action.type) {
    case LandingPageActions.CLEAR_LANDING_STATE:
      return {
        ...initialState
      };
    case LandingPageActions.LANDING_PAGE_SUCCESS:
      return {
        ...state,
        featured: action.payload.featured ? action.payload.featured : state.featured,
        featuredCollections: action.payload.featuredCollections
          ? action.payload.featuredCollections
          : state.featuredCollections,
        newArrivals: action.payload.newArrivals ? action.payload.newArrivals : state.newArrivals,
        topRated: action.payload.topRated ? action.payload.topRated : state.topRated,
        lastChance: action.payload.lastChance ? action.payload.lastChance : state.lastChance,
        heroProduct: action.payload.heroProduct ? action.payload.heroProduct : state.heroProduct,
        noMore: action.payload.noMore
      };
    case LandingPageActions.LANDING_PAGE_FAILED:
      return {
        ...state,
        failedMessage: action.payload.failedMessage
      };
    case LandingPageActions.LOAD_MORE_SUCCESS:
      return {
        ...state,
        newArrivals: action.payload.newArrivals
          ? [...state.newArrivals, ...action.payload.newArrivals]
          : state.newArrivals,
        topRated: action.payload.topRated
          ? [...state.topRated, ...action.payload.topRated]
          : state.topRated,
        lastChance: action.payload.lastChance
          ? [...state.lastChance, ...action.payload.lastChance]
          : state.lastChance,
        noMore: action.payload.noMore
      };
    default:
      return state;
  }
}
