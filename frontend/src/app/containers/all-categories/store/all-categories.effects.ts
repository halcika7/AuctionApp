import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as CategoriesPageActions from '@app/containers/all-categories/store/all-categories.actions';
import { map, catchError, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class CategoriesPageEffects {
  @Effect()
  allCategoriesStart = this.actions$.pipe(
    ofType(CategoriesPageActions.ALL_CATEGORIES_START),
    concatMap(() => {
      return this.http.get<{ categories?; failedMessage? }>('/categories/').pipe(
        map(({ categories }) => new CategoriesPageActions.CategoriesSuccess(categories)),
        catchError(({ error }) =>
          of(new CategoriesPageActions.CategoriesFailed(error.failedMessage))
        )
      );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
