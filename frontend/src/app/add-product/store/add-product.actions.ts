import { AddProductUserInfo } from './add-product.reducer';
import { Brand, Filters } from "@app/shop-page/store/shop-page.reducer";
import { Category } from "@app/containers/all-categories/store/all-categories.reducer";
import { Action } from "@ngrx/store";

export const ADD_PRODUCT_START = "ADD_PRODUCT_START";
export const ADD_PRODUCT_SUCCESS = "ADD_PRODUCT_SUCCESS";
export const ADD_PRODUCT_FAILED = "ADD_PRODUCT_FAILED";
export const ADD_USER_PRODUCT_START = "ADD_USER_PRODUCT_START";

export const CLEAR_SUBATEGORIES = "CLEAR_SUBATEGORIES";
export const CLEAR_BRANDS = "CLEAR_BRANDS";
export const CLEAR_FILTERS = "CLEAR_FILTERS";

export class AddProductStart implements Action {
  readonly type = ADD_PRODUCT_START;
  constructor(public url: string) {}
}
export class AddUserProductStart implements Action {
  readonly type = ADD_USER_PRODUCT_START;
  constructor(public formData: FormData) {}
}
export class AddProductSuccess implements Action {
  readonly type = ADD_PRODUCT_SUCCESS;
  constructor(
    public payload: {
      categories?: Category[];
      subcategories?: Category[];
      Brands?: Brand[];
      Filters?: Filters[];
      numberOfActiveProducts?: number;
      userInfo?: AddProductUserInfo;
    }
  ) {}
}
export class AddProductFailed implements Action {
  readonly type = ADD_PRODUCT_FAILED;
  constructor(
    public payload: {
      message?: string;
      authorizationError?: string;
      accessToken?: string;
      errors?: any;
    }
  ) {}
}

export class ClearSubcategories implements Action {
  readonly type = CLEAR_SUBATEGORIES;
  constructor() {}
}

export class ClearBrands implements Action {
  readonly type = CLEAR_BRANDS;
  constructor() {}
}

export class ClearFilters implements Action {
  readonly type = CLEAR_FILTERS;
  constructor() {}
}

export type AddProductActions =
  | AddProductStart
  | AddUserProductStart
  | AddProductSuccess
  | AddProductFailed
  | ClearSubcategories
  | ClearBrands
  | ClearFilters;
