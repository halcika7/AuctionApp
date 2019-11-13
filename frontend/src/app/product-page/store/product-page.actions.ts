import { Action } from "@ngrx/store";
import { FullProduct, Bid } from "./product-page.reducer";
import { Product } from "@app/landing-page/store/landing-page.reducers";

export const PRODUCT_START = "PRODUCT_START";
export const PRODUCT_SUCCESS = "PRODUCT_SUCCESS";
export const PRODUCT_FAILED = "PRODUCT_FAILED";

export const SIMILAR_PRODUCT_START = "SIMILAR_PRODUCT_START";
export const SIMILAR_PRODUCT_SUCCESS = "SIMILAR_PRODUCT_SUCCESS";
export const SIMILAR_PRODUCT_FAILED = "SIMILAR_PRODUCT_FAILED";

export const PRODUCT_BID_START = "PRODUCT_BID_START";
export const PRODUCT_BID_SUCCESS = "PRODUCT_BID_SUCCESS";
export const PRODUCT_BID_FAILED = "PRODUCT_BID_FAILED";

export const CLEAR_PRODUCT_STATE = "CLEAR_PRODUCT_STATE";
export const CLEAR_PRODUCT_MESSAGES = "CLEAR_PRODUCT_MESSAGES";

export class ClearProductState implements Action {
  readonly type = CLEAR_PRODUCT_STATE;
  constructor() {}
}

export class ClearProductMessages implements Action {
  readonly type = CLEAR_PRODUCT_MESSAGES;
  constructor() {}
}

export class ProductStart implements Action {
  readonly type = PRODUCT_START;
  constructor(public id: string) {}
}

export class ProductSuccess implements Action {
  readonly type = PRODUCT_SUCCESS;
  constructor(public payload: { product: FullProduct; bids?: Bid[] }) {}
}

export class ProductFailed implements Action {
  readonly type = PRODUCT_FAILED;
  constructor(public payload: { error: { error: string } }) {}
}

export class SimilarProductStart implements Action {
  readonly type = SIMILAR_PRODUCT_START;
  constructor(public productId: string, public subcategoryId: string) {}
}

export class SimilarProductSuccess implements Action {
  readonly type = SIMILAR_PRODUCT_SUCCESS;
  constructor(public payload: { similarProducts: Product[] }) {}
}

export class ProductBidStart implements Action {
  readonly type = PRODUCT_BID_START;
  constructor(public productId: string, public bid: number) {}
}

export class ProductBidSuccess implements Action {
  readonly type = PRODUCT_BID_SUCCESS;
  constructor(
    public payload: {
      message: string;
      highest_bid: string | number;
      accessToken?: string;
    }
  ) {}
}

export class ProductBidFailed implements Action {
  readonly type = PRODUCT_BID_FAILED;
  constructor(
    public payload: {
      error: {
        message?: string;
        authorizationError?: string;
        accessToken?: string;
      };
    }
  ) {}
}

export type ProductPageActions =
  | ProductStart
  | ProductSuccess
  | ProductFailed
  | ProductBidStart
  | ProductBidSuccess
  | ProductBidFailed
  | SimilarProductStart
  | SimilarProductSuccess
  | ClearProductState
  | ClearProductMessages;
