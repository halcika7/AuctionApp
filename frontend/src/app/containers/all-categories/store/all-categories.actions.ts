import { Action } from "@ngrx/store";
import { Categories } from "@app/containers/all-categories/store/all-categories.reducer";

export const ALL_CATEGORIES_START = "ALL_CATEGORIES_START";
export const ALL_CATEGORIES_SUCCESS = "ALL_CATEGORIES_SUCCESS";
export const ALL_CATEGORIES_FAILED = "ALL_CATEGORIES_FAILED";

export class CategoriesStart implements Action {
  readonly type = ALL_CATEGORIES_START;
}

export class CategoriesSuccess implements Action {
  readonly type = ALL_CATEGORIES_SUCCESS;
  constructor(public payload: Categories[]) {}
}

export class CategoriesFailed implements Action {
  readonly type = ALL_CATEGORIES_FAILED;
  constructor(public payload: { failedMessage: string }) {}
}

export type CategoriesPageActions = CategoriesStart | CategoriesSuccess | CategoriesFailed;
