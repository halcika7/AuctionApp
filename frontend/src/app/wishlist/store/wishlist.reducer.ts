import * as WishlistActions from "./wishlist.actions";

export interface State {
  wishlistIds: string[];
}

const initialState: State = {
  wishlistIds: []
};

export function wishlistReducer(
  state = initialState,
  action: WishlistActions.WishlistActions
) {
  switch (action.type) {
    case WishlistActions.USER_WISHLIST_IDS_SUCCESS: {
      return {
        wishlistIds: action.payload.ids ? action.payload.ids : state.wishlistIds
      };
    }
    case WishlistActions.USER_WISHLIST_IDS_FAILED: {
      return {
        ...state,
        wishlistIds: []
      };
    }
    default:
      return state;
  }
}
