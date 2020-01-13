import * as ProductPageActions from "./product-page.actions";
import { Product } from "@app/landing-page/store/landing-page.reducers";

export interface FullProduct extends Product {
  status?: string;
  paid?: boolean;
  auctionStart: Date;
  auctionEnd: Date;
  highest_bid: string | number;
  number_of_bids: string | number;
  ProductImages: { image: string }[] | [];
}

export interface Bid {
  dateBid: Date;
  price: number;
  User: { firstName: string; lastName: string; photo: string };
}

export interface OwnerInfo {
  photo: string;
  full_name: string;
  avg_rating: string;
}

export interface State {
  product: FullProduct;
  similarProducts: Product[];
  bids: Bid[];
  message: string;
  success: boolean;
  numberOfViewers: { views?: number; productId?: string; userIds?: string[] };
  highestBidUserId: string;
  ownerInfo: OwnerInfo;
  wonAuction: boolean;
}

const initialState: State = {
  product: {
    id: "",
    name: "",
    details: "",
    picture: "",
    status: "",
    price: 0,
    auctionStart: null,
    auctionEnd: null,
    userId: "",
    subcategoryId: "",
    highest_bid: "",
    number_of_bids: "",
    ProductImages: []
  },
  ownerInfo: {
    photo: '',
    full_name: '',
    avg_rating: ''
  },
  similarProducts: [],
  bids: [],
  message: "",
  success: false,
  numberOfViewers: { views: 0, productId: null, userIds: [] },
  highestBidUserId: "",
  wonAuction: false
};

export function productPageReducer(
  state = initialState,
  action: ProductPageActions.ProductPageActions
) {
  switch (action.type) {
    case ProductPageActions.PRODUCT_START:
      return {
        ...initialState,
        message:
          state.message === "Please login in order to place bid!"
            ? state.message
            : ""
      };
    case ProductPageActions.PRODUCT_SUCCESS:
      return {
        ...state,
        product: action.payload.product
          ? action.payload.product
          : state.product,
        bids: action.payload.bids ? action.payload.bids : state.bids,
        message: action.payload.message
          ? action.payload.message
          : state.message,
        success: action.payload.message ? false : state.success,
        highestBidUserId: action.payload.highestBidUserId
          ? action.payload.highestBidUserId
          : "",
        ownerInfo: action.payload.ownerInfo ? action.payload.ownerInfo : state.ownerInfo,
        wonAuction: action.payload.wonAuction
      };
    case ProductPageActions.SIMILAR_PRODUCT_SUCCESS:
      return {
        ...state,
        similarProducts: action.payload.similarProducts
      };
    case ProductPageActions.PRODUCT_FAILED:
      return {
        ...initialState,
        message: action.payload.error.message
          ? action.payload.error.message
          : ""
      };
    case ProductPageActions.CLEAR_PRODUCT_MESSAGES:
      return {
        ...state,
        message: "",
        success: false,
        wonAuction: action.clearAuctionWon ? false : state.wonAuction
      };
    case ProductPageActions.PRODUCT_BID_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        success: true
      };
    case ProductPageActions.PRODUCT_SET_MESSAGE:
      return {
        ...state,
        message: action.message,
        success: false
      };
    case ProductPageActions.PRODUCT_BID_FAILED:
      return {
        ...state,
        message: action.payload.error.message
          ? action.payload.error.message
          : "Please login in order to place bid!",
        success: false
      };
    case ProductPageActions.SET_NUMBER_OF_VIEWERS: {
      return {
        ...state,
        numberOfViewers: action.payload
      };
    }
    case ProductPageActions.UPDATE_PRODUCT_AFTER_BID: {
      return {
        ...state,
        product: {
          ...state.product,
          highest_bid: action.highest_bid,
          number_of_bids:
            typeof state.product.number_of_bids === "string"
              ? parseInt(state.product.number_of_bids) + 1
              : state.product.number_of_bids + 1
        },
        highestBidUserId: action.highestBidUserId
      };
    }
    case ProductPageActions.UPDATE_PRODUCT_AFTER_AUCTION_END: {
      return {
        ...state,
        product: {
          ...state.product,
          status: "closed"
        },
        wonAuction: action.wonAuction ? action.wonAuction : false
      };
    }
    default:
      return state;
  }
}
