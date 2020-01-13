import { Brand, Filters } from "@app/shop-page/store/shop-page.reducer";
import { Category } from "@app/containers/all-categories/store/all-categories.reducer";
import * as AddProductActions from "./add-product.actions";

export interface AddProductUserInfo {
  hasCard: boolean;
  phoneNumber: string;
  OptionalInfo: {
    street: string;
    city: string;
    zip: string;
    state: string;
    country: string;
  };
  CardInfo: {
    name: string;
    number: string;
    cvc: string;
    exp_year: number;
    exp_month: string;
  }
}

export interface State {
  categories: Category[];
  subcategories: Category[];
  brands: Brand[];
  filters: Filters[];
  hasActiveProduct: boolean;
  errors: {
    name?: "";
    price?: "";
    startDate?: "";
    endDate?: "";
    description?: "";
    images?: "";
    category?: "";
    subcategory?: "";
    brand?: "";
    filterErrors?: [];
    address?: "";
    city?: "";
    country?: "";
    phone?: "";
    zip?: "";
    CVC?: "";
    cName?: "";
    cNumber?: "";
    exp_year?: "";
    exp_month?: "";
    card?: "";
  };
  userInfo: AddProductUserInfo;
  success: boolean;
  message: string;
}

const initialState: State = {
  categories: [],
  subcategories: [],
  brands: [],
  filters: [],
  hasActiveProduct: null,
  errors: {},
  userInfo: {
    hasCard: false,
    phoneNumber: "",
    OptionalInfo: {
      street: "",
      city: "",
      zip: "",
      state: "",
      country: ""
    },
    CardInfo: {
      name: "",
      number: "",
      cvc: "",
      exp_month: "",
      exp_year: null
    }
  },
  success: false,
  message: ""
};

export function addProductReducer(
  state = initialState,
  action: AddProductActions.AddProductActions
) {
  switch (action.type) {
    case AddProductActions.ADD_PRODUCT_SUCCESS: {
      return {
        categories: action.payload.categories
          ? action.payload.categories
          : state.categories,
        subcategories: action.payload.subcategories
          ? action.payload.subcategories
          : state.subcategories,
        brands: action.payload.Brands ? action.payload.Brands : state.brands,
        filters: action.payload.Filters
          ? action.payload.Filters
          : state.filters,
        hasActiveProduct:
          action.payload.hasActiveProduct != null
            ? action.payload.hasActiveProduct
            : state.hasActiveProduct,
        errors: {},
        userInfo: action.payload.userInfo
          ? action.payload.userInfo
          : state.userInfo,
        message: action.payload.message ? action.payload.message : "",
        success: action.payload.message ? true : false
      };
    }
    case AddProductActions.ADD_PRODUCT_FAILED: {
      return {
        ...state,
        errors: action.payload.errors ? action.payload.errors : {},
        message: action.payload.failedMessage ? action.payload.failedMessage : "",
        success: false
      };
    }
    case AddProductActions.CLEAR_ADD_PRODUCT_MESSAGES: {
      return {
        ...state,
        message: "",
        success: false
      };
    }
    case AddProductActions.CLEAR_ADD_PRODUCT_STATE: {
      return {
        ...initialState
      };
    }
    case AddProductActions.CLEAR_BRANDS: {
      return {
        ...state,
        brands: []
      };
    }
    case AddProductActions.CLEAR_SUBATEGORIES: {
      return {
        ...state,
        subcategories: []
      };
    }
    case AddProductActions.CLEAR_FILTERS: {
      return {
        ...state,
        filters: []
      };
    }
    default:
      return state;
  }
}
