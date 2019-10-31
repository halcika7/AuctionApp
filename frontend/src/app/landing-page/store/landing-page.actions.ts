import { Action } from '@ngrx/store';
import { Product, Category } from './landing-page.reducers';

export const FEATURED_PRODUCTS_START = 'FEATURED_PRODUCTS_START';
export const FEATURED_COLLECTIONS_START = 'FEATURED_COLLECTIONS_START';
export const NEW_ARRIVALS_START = 'NEW_ARRIVALS_START';
export const TOP_RATED_START = 'TOP_RATED_START';
export const LAST_CHANCE_START = 'LAST_CHANCE_START';
export const HERO_PRODUCT_START = 'HERO_PRODUCT_START';
export const CATEGORIES_START = 'CATEGORIES_START';

export const LANDING_PAGE_SUCCESS = 'LANDING_PAGE_SUCCESS';
export const LANDING_PAGE_FAILED = 'LANDING_PAGE_FAILED';

export class FeaturedProductStart implements Action {
  readonly type = FEATURED_PRODUCTS_START;
}

export class FeaturedCollectionStart implements Action {
  readonly type = FEATURED_COLLECTIONS_START;
}

export class NewArrivalsProductStart implements Action {
  readonly type = NEW_ARRIVALS_START;
}

export class TopRatedProductStart implements Action {
  readonly type = TOP_RATED_START;
}

export class LastChanceProductStart implements Action {
  readonly type = LAST_CHANCE_START;
}

export class HeroProductStart implements Action {
  readonly type = HERO_PRODUCT_START;
}

export class CategoriesStart implements Action {
  readonly type = CATEGORIES_START;
}

export class LandingPageSuccess implements Action {
  readonly type = LANDING_PAGE_SUCCESS;
  constructor(
    public payload: {
      categories?: Category[];
      heroProduct?: Product;
      lastChance?: Product[];
      topRated?: Product[];
      newArrivals?: Product[];
      featured?: Product[];
      featuredCollections?: Product[];
    }
  ) {}
}

export class LandingPageFailed implements Action {
  readonly type = LANDING_PAGE_FAILED;
  constructor(public payload: { failedMessage: string }) {}
}

export type LandingPageActions =
  | FeaturedProductStart
  | FeaturedCollectionStart
  | NewArrivalsProductStart
  | TopRatedProductStart
  | LastChanceProductStart
  | HeroProductStart
  | CategoriesStart
  | LandingPageSuccess
  | LandingPageFailed;
