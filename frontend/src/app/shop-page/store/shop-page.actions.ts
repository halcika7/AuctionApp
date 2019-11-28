import { Action } from "@ngrx/store";
import { Brand, Prices, Filters, PriceRange } from "./shop-page.reducer";
import { Product } from "@app/landing-page/store/landing-page.reducers";

export const SHOP_PAGE_START = "SHOP_PAGE_START";
export const SHOP_PAGE_SUCCESS = "SHOP_PAGE_SUCCESS";
export const SHOP_PAGE_FAILED = "SHOP_PAGE_FAILED";
export const SHOP_PAGE_CLEAR = "SHOP_PAGE_CLEAR";

export const SHOP_PAGE_LOAD_MORE_START = "SHOP_PAGE_LOAD_MORE_START";
export const SHOP_PAGE_LOAD_MORE_SUCCESS = "SHOP_PAGE_LOAD_MORE_SUCCESS";

export class ShopStart implements Action {
  readonly type = SHOP_PAGE_START;
  constructor(public url: string) {}
}

export class ShopSuccess implements Action {
  readonly type = SHOP_PAGE_SUCCESS;
  constructor(
    public payload: {
      Brands?: Brand[];
      prices?: Prices;
      Filters?: Filters[];
      products?: Product[];
      noMore?: boolean;
      priceRange?: PriceRange[];
    }
  ) {}
}

export class ShopFailed implements Action {
  readonly type = SHOP_PAGE_FAILED;
  constructor(public payload: { failedMessage: string }) {}
}

export class ClearShopPageState implements Action {
  readonly type = SHOP_PAGE_CLEAR;
}

export class ShopPageLoadMoreStart implements Action {
  readonly type = SHOP_PAGE_LOAD_MORE_START;
  constructor(public url: string) {}
}

export class ShopPageLoadMoreSuccess implements Action {
  readonly type = SHOP_PAGE_LOAD_MORE_SUCCESS;
  constructor(
    public payload: {
      products?: Product[];
      noMore?: boolean;
    }
  ) {}
}

export type ShopPageActions =
  | ShopStart
  | ShopSuccess
  | ShopFailed
  | ClearShopPageState
  | ShopPageLoadMoreStart
  | ShopPageLoadMoreSuccess;
