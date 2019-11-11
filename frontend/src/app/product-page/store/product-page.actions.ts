import { Action } from '@ngrx/store';
import { FullProduct } from './product-page.reducer';
import { Product } from '@app/landing-page/store/landing-page.reducers';

export const PRODUCT_START = 'PRODUCT_START';
export const PRODUCT_SUCCESS = 'PRODUCT_SUCCESS';
export const PRODUCT_FAILED = 'PRODUCT_FAILED';

export const CLEAR_PRODUCT_STATE = 'CLEAR_PRODUCT_STATE';

export class ClearProductState implements Action {
  readonly type = CLEAR_PRODUCT_STATE;
  constructor() {}
}

export class ProductStart implements Action {
  readonly type = PRODUCT_START;
  constructor(public id: string) {}
}

export class ProductSuccess implements Action {
  readonly type = PRODUCT_SUCCESS;
  constructor(public payload: { product: FullProduct; similarProducts: Product[] }) {}
}

export class ProductFailed implements Action {
  readonly type = PRODUCT_FAILED;
  constructor(public payload: { error: { error: string } }) {}
}

export type ProductPageActions = ProductStart | ProductSuccess | ProductFailed | ClearProductState;
