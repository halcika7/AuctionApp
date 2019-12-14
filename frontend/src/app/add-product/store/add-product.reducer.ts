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
}

export interface State {
  categories: Category[];
  subcategories: Category[];
  brands: Brand[];
  filters: Filters[];
  numberOfActiveProducts: number;
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
    filters?: [];
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
  };
  userInfo: AddProductUserInfo;
}

const initialState: State = {
  categories: [],
  subcategories: [],
  brands: [],
  filters: [],
  numberOfActiveProducts: null,
  errors: {},
  userInfo: {
    hasCard: false,
    phoneNumber: '',
    OptionalInfo: {
      street: "",
      city: "",
      zip: "",
      state: "",
      country: ""
    }
  }
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
        numberOfActiveProducts:
          action.payload.numberOfActiveProducts ||
          action.payload.numberOfActiveProducts == 0
            ? action.payload.numberOfActiveProducts
            : state.numberOfActiveProducts,
        errors: {},
        userInfo: action.payload.userInfo
          ? action.payload.userInfo
          : state.userInfo
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
