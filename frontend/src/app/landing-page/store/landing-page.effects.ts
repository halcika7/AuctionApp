import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as LandingPageActions from './landing-page.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class LandingPageEffects {
  @Effect()
  featuredProductStart = this.actions$.pipe(
    ofType(LandingPageActions.FEATURED_PRODUCTS_START),
    switchMap(() => {
      return this.http.get<{ featured?; failedMessage? }>('/landing/featured').pipe(
        map(data => new LandingPageActions.LandingPageSuccess(data)),
        catchError(({ failedMessage }) =>
          of(new LandingPageActions.LandingPageFailed(failedMessage))
        )
      );
    })
  );

  @Effect()
  featuredCollectionStart = this.actions$.pipe(
    ofType(LandingPageActions.FEATURED_COLLECTIONS_START),
    switchMap(() => {
      return this.http.get<{ featuredCollections?; failedMessage? }>('/landing/featured/3').pipe(
        map(data => new LandingPageActions.LandingPageSuccess(data)),
        catchError(({ failedMessage }) =>
          of(new LandingPageActions.LandingPageFailed(failedMessage))
        )
      );
    })
  );

  @Effect()
  newArrivalsProductStart = this.actions$.pipe(
    ofType(LandingPageActions.NEW_ARRIVALS_START),
    switchMap(() => {
      return this.http.get<{ newArrivals?; failedMessage? }>('/landing/newarrivals').pipe(
        map(data => new LandingPageActions.LandingPageSuccess(data)),
        catchError(({ failedMessage }) =>
          of(new LandingPageActions.LandingPageFailed(failedMessage))
        )
      );
    })
  );

  @Effect()
  topRatedProductStart = this.actions$.pipe(
    ofType(LandingPageActions.TOP_RATED_START),
    switchMap(() => {
      return this.http.get<{ topRated?; failedMessage? }>('/landing/toprated').pipe(
        map(data => new LandingPageActions.LandingPageSuccess(data)),
        catchError(({ failedMessage }) =>
          of(new LandingPageActions.LandingPageFailed(failedMessage))
        )
      );
    })
  );

  @Effect()
  lastChanceProductStart = this.actions$.pipe(
    ofType(LandingPageActions.LAST_CHANCE_START),
    switchMap(() => {
      return this.http.get<{ lastChance?; failedMessage? }>('/landing/lastchance').pipe(
        map(data => new LandingPageActions.LandingPageSuccess(data)),
        catchError(({ failedMessage }) =>
          of(new LandingPageActions.LandingPageFailed(failedMessage))
        )
      );
    })
  );

  @Effect()
  heroProduct = this.actions$.pipe(
    ofType(LandingPageActions.HERO_PRODUCT_START),
    switchMap(() => {
      return this.http.get<{ heroProduct?; failedMessage? }>('/landing/hero').pipe(
        map(data => new LandingPageActions.LandingPageSuccess(data)),
        catchError(({ failedMessage }) =>
          of(new LandingPageActions.LandingPageFailed(failedMessage))
        )
      );
    })
  );

  @Effect()
  categories = this.actions$.pipe(
    ofType(LandingPageActions.CATEGORIES_START),
    switchMap(() => {
      return this.http.get<{ categories?; failedMessage? }>('/landing/categories').pipe(
        map(data => new LandingPageActions.LandingPageSuccess(data)),
        catchError(({ failedMessage }) =>
          of(new LandingPageActions.LandingPageFailed(failedMessage))
        )
      );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
