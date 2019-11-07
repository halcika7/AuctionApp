import { Action } from '@ngrx/store';
import { Product } from '@app/landing-page/store/landing-page.reducers';
import { Categories } from '@app/containers/all-categories/store/all-categories.reducer';

export const LOAD_MORE_START = 'LOAD_MORE_START';
export const LOAD_MORE_SUCCESS = 'LOAD_MORE_SUCCESS';
export const LOAD_MORE_FAILED = 'LOAD_MORE_FAILED';

export const LANDING_PAGE_START = 'LANDING_PAGE_START';
export const LANDING_PAGE_SUCCESS = 'LANDING_PAGE_SUCCESS';
export const LANDING_PAGE_FAILED = 'LANDING_PAGE_FAILED';

export class LoadMoreProductsStart implements Action {
  readonly type = LOAD_MORE_START;
  constructor(public productType: string, public offset: number) {}
}

export class LoadMoreProductsSuccess implements Action {
  readonly type = LOAD_MORE_SUCCESS;
  constructor(
    public payload: {
      lastChance?: Product[];
      topRated?: Product[];
      newArrivals?: Product[];
      noMore: boolean;
    }
  ) {}
}

export class LandingPageStart implements Action {
  readonly type = LANDING_PAGE_START;
  constructor(public path: string) {}
}

export class LandingPageSuccess implements Action {
  readonly type = LANDING_PAGE_SUCCESS;
  constructor(
    public payload: {
      categories?: Categories[];
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
  | LandingPageStart
  | LandingPageSuccess
  | LandingPageFailed
  | LoadMoreProductsStart
  | LoadMoreProductsSuccess;
