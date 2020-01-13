import { Action } from "@ngrx/store";
import { UserInfo, ProfileProduct, ProfileBid } from "./profile.reducer";

export const PROFILE_START = "PROFILE_START";
export const PROFILE_SUCCESS = "PROFILE_SUCCESS";
export const PROFILE_FAILED = "PROFILE_FAILED";

export const LOAD_MORE_PROFILE_START = "LOAD_MORE_PROFILE_START";
export const LOAD_MORE_PROFILE_SUCCESS = "LOAD_MORE_PROFILE_SUCCESS";

export const UPDATE_PROFILE_START = "UPDATE_PROFILE_START";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILED = "UPDATE_PROFILE_FAILED";

export const DEACTIVATE_ACCOUNT = "DEACTIVATE_ACCOUNT";

export const SET_AUCTION_WON_MESSAGE = "SET_AUCTION_WON_MESSAGE";

export const CLEAR_PROFILE = "CLEAR_PROFILE";
export const CLEAR_PROFILE_MESSAGES = "CLEAR_PROFILE_MESSAGES";

export class ClearProfile implements Action {
  readonly type = CLEAR_PROFILE;
  constructor() {}
}

export class ClearProfileMessages implements Action {
  readonly type = CLEAR_PROFILE_MESSAGES;
  constructor(public clearAuctionWonMessage?: boolean) {}
}

export class ProfileStart implements Action {
  readonly type = PROFILE_START;
  constructor(public url: string) {}
}

export class ProfileSuccess implements Action {
  readonly type = PROFILE_SUCCESS;
  constructor(
    public payload: {
      userInfo?: UserInfo;
      accessToken?: string;
      products?: ProfileProduct[];
      bids?: ProfileBid[];
      noMore?: boolean;
    }
  ) {}
}

export class ProfileFailed implements Action {
  readonly type = PROFILE_FAILED;
  constructor(
    public payload: {
      message?: string;
      authorizationError?: string;
      accessToken?: string;
    }
  ) {}
}

export class UpdateProfileStart implements Action {
  readonly type = UPDATE_PROFILE_START;
  constructor(public formData) {}
}

export class UpdateProfileSuccess implements Action {
  readonly type = UPDATE_PROFILE_SUCCESS;
  constructor(
    public payload: {
      userInfo?: UserInfo;
      message: string;
      accessToken?: string;
    }
  ) {}
}

export class UpdateProfileFailed implements Action {
  readonly type = UPDATE_PROFILE_FAILED;
  constructor(
    public payload: {
      errors?: any;
      failedMessage?: string;
      authorizationError?: string;
      accessToken?: string;
    }
  ) {}
}

export class LoadMoreStart implements Action {
  readonly type = LOAD_MORE_PROFILE_START;
  constructor(public url: string) {}
}

export class LoadMoreSuccess implements Action {
  readonly type = LOAD_MORE_PROFILE_SUCCESS;
  constructor(
    public payload: {
      accessToken?: string;
      products?: ProfileProduct[];
      bids?: ProfileBid[];
      noMore?: boolean;
    }
  ) {}
}

export class DeactivateAccount implements Action {
  readonly type = DEACTIVATE_ACCOUNT;
  constructor() {}
}

export class SetAuctionWonMessage implements Action {
  readonly type = SET_AUCTION_WON_MESSAGE;
  constructor(public message: string, public productId: string) {}
}

export type ProfileActions =
  | ProfileStart
  | ProfileSuccess
  | ProfileFailed
  | LoadMoreSuccess
  | LoadMoreStart
  | UpdateProfileStart
  | UpdateProfileSuccess
  | UpdateProfileFailed
  | ClearProfile
  | SetAuctionWonMessage
  | ClearProfileMessages;
