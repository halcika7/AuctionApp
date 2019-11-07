import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '@app/auth/store/auth.reducer';
import * as fromLandingPage from '@app/landing-page/store/landing-page.reducers';
import * as fromCategoriesPage from '@app/containers/all-categories/store/all-categories.reducer';

export interface AppState {
  auth: fromAuth.State;
  landingPage: fromLandingPage.State;
  categoriesPage: fromCategoriesPage.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  landingPage: fromLandingPage.landingPageReducer,
  categoriesPage: fromCategoriesPage.categoriesPageReducer
};
