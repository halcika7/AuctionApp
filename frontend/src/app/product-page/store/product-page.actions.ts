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

export const CLEAR_PRODUCT_MESSAGES = "CLEAR_PRODUCT_MESSAGES";

export const SET_NUMBER_OF_VIEWERS = "SET_NUMBER_OF_VIEWERS";

export const PRODUCT_SET_MESSAGE = "PRODUCT_SET_MESSAGE";

export const GET_PRODUCT_BIDS = "GET_PRODUCT_BIDS";

export const UPDATE_PRODUCT_AFTER_BID = "UPDATE_PRODUCT_AFTER_BID";

export const UPDATE_PRODUCT_AFTER_AUCTION_END =
  "UPDATE_PRODUCT_AFTER_AUCTION_END";

export class ClearProductMessages implements Action {
  readonly type = CLEAR_PRODUCT_MESSAGES;
  constructor(public clearAuctionWon?: boolean) {}
}

export class ProductStart implements Action {
  readonly type = PRODUCT_START;
  constructor(public id: string, public subcategoryId: string) {}
}

export class GetProductBids implements Action {
  readonly type = GET_PRODUCT_BIDS;
  constructor(public productId: string, public subcategoryId: string) {}
}

export class UpdateProductAfterBid implements Action {
  readonly type = UPDATE_PRODUCT_AFTER_BID;
  constructor(public highest_bid: any, public highestBidUserId: string) {}
}

export class ProductSuccess implements Action {
  readonly type = PRODUCT_SUCCESS;
  constructor(
    public payload: {
      product?: FullProduct;
      bids?: Bid[];
      message?: string;
      highestBidUserId?: string;
      wonAuction?: boolean;
    }
  ) {}
}

export class ProductFailed implements Action {
  readonly type = PRODUCT_FAILED;
  constructor(public payload: { error: { message: string } }) {}
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

export class SetNumberOfViewers implements Action {
  readonly type = SET_NUMBER_OF_VIEWERS;

  constructor(public payload: { views: number; productId: string; userIds: string[] }) {}
}

export class SetMessage implements Action {
  readonly type = PRODUCT_SET_MESSAGE;

  constructor(public message: string) {}
}

export class UpdateProductAfterAuctionEnd implements Action {
  readonly type = UPDATE_PRODUCT_AFTER_AUCTION_END;

  constructor(public wonAuction?: boolean) {}
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
  | SetNumberOfViewers
  | SetMessage
  | UpdateProductAfterBid
  | GetProductBids
  | UpdateProductAfterAuctionEnd
  | ClearProductMessages;
