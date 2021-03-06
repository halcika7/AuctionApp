import * as CategoriesPageActions from "@app/containers/all-categories/store/all-categories.actions";

export interface Category {
  id: string;
  name: string;
  number_of_products?: string;
}

export interface Categories extends Category {
  Subcategories: Category[];
}

export interface State {
  categories: Categories[];
  failedMessage: string;
}

const initialState: State = {
  categories: [],
  failedMessage: ""
};

export function categoriesPageReducer(
  state = initialState,
  action: CategoriesPageActions.CategoriesPageActions
) {
  switch (action.type) {
    case CategoriesPageActions.ALL_CATEGORIES_SUCCESS:
      return {
        ...initialState,
        categories: action.payload
      };
    case CategoriesPageActions.ALL_CATEGORIES_FAILED:
      return {
        ...initialState,
        failedMessage: action.payload.failedMessage
      };
    default:
      return state;
  }
}
