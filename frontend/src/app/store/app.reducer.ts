import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '@app/auth/store/auth.reducer';
import * as fromLandingPage from '@app/landing-page/store/landing-page.reducers';
import * as fromCategoriesPage from '@app/containers/all-categories/store/all-categories.reducer';
import * as fromProductPage from '@app/product-page/store/product-page.reducer';

export interface AppState {
  auth: fromAuth.State;
  landingPage: fromLandingPage.State;
  categoriesPage: fromCategoriesPage.State;
  productPage: fromProductPage.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  landingPage: fromLandingPage.landingPageReducer,
  categoriesPage: fromCategoriesPage.categoriesPageReducer,
  productPage: fromProductPage.productPageReducer
};
