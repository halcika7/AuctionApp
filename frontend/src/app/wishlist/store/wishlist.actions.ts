import { Action } from "@ngrx/store";

export const USER_WISHLIST_IDS_START = "USER_WISHLIST_IDS_START";
export const USER_WISHLIST_IDS_SUCCESS = "USER_WISHLIST_IDS_SUCCESS";
export const USER_WISHLIST_IDS_FAILED = "USER_WISHLIST_IDS_FAILED";
export const DELETE_FROM_WISHLIST_START = "DELETE_FROM_WISHLIST_START";
export const ADD_TO_WISHLIST_START = "ADD_TO_WISHLIST_START";

export class UserWishlistIdsStart implements Action {
  readonly type = USER_WISHLIST_IDS_START;
  constructor() {}
}

export class DeleteFromWishlistStart implements Action {
  readonly type = DELETE_FROM_WISHLIST_START;
  constructor(public productId: string) {}
}

export class AddToWishlistStart implements Action {
  readonly type = ADD_TO_WISHLIST_START;
  constructor(public productId: string) {}
}

export class UserWishlistIdsSuccess implements Action {
  readonly type = USER_WISHLIST_IDS_SUCCESS;
  constructor(public payload: { ids: string[]; accessToken?: string }) {}
}

export class UserWishlistIdsFailed implements Action {
  readonly type = USER_WISHLIST_IDS_FAILED;
  constructor(
    public payload: {
      authorizationError?: string;
      accessToken?: string;
    }
  ) {}
}

export type WishlistActions =
  | UserWishlistIdsStart
  | DeleteFromWishlistStart
  | AddToWishlistStart
  | UserWishlistIdsSuccess
  | UserWishlistIdsFailed;
