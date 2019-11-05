import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as LandingPageActions from '@app/landing-page/store/landing-page.actions';

@Injectable()
export class LandingPageEffects {
  @Effect()
  loadMore = this.actions$.pipe(
    ofType(LandingPageActions.LOAD_MORE_START),
    switchMap(({ productType, offset }) => {
      return this.http.get<any>(`/landing/${productType}/8/${offset}`).pipe(
        map(data => new LandingPageActions.LoadMoreProductsSuccess(data)),
        catchError(({ failedMessage }) =>
          of(new LandingPageActions.LandingPageFailed(failedMessage))
        )
      );
    })
  );

  @Effect()
  landingStart = this.actions$.pipe(
    ofType(LandingPageActions.LANDING_PAGE_START),
    concatMap(({ path }) => {
      return this.http.get<any>(`/landing/${path}`).pipe(
        map(data => new LandingPageActions.LandingPageSuccess(data)),
        catchError(({ failedMessage }) =>
          of(new LandingPageActions.LandingPageFailed(failedMessage))
        )
      );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
