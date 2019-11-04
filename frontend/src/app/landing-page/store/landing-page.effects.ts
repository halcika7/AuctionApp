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
    switchMap(() => this.helperFunction('featured/4'))
  );

  @Effect()
  featuredCollectionStart = this.actions$.pipe(
    ofType(LandingPageActions.FEATURED_COLLECTIONS_START),
    switchMap(() => this.helperFunction('featuredCollections/3'))
  );

  @Effect()
  newArrivalsProductStart = this.actions$.pipe(
    ofType(LandingPageActions.NEW_ARRIVALS_START),
    switchMap(() => this.helperFunction('newArrivals/8'))
  );

  @Effect()
  topRatedProductStart = this.actions$.pipe(
    ofType(LandingPageActions.TOP_RATED_START),
    switchMap(() => this.helperFunction('topRated/8'))
  );

  @Effect()
  lastChanceProductStart = this.actions$.pipe(
    ofType(LandingPageActions.LAST_CHANCE_START),
    switchMap(() => this.helperFunction('lastChance/8'))
  );

  @Effect()
  heroProduct = this.actions$.pipe(
    ofType(LandingPageActions.HERO_PRODUCT_START),
    switchMap(() => this.helperFunction('heroProduct/1'))
  );

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

  helperFunction(path) {
    return this.http.get<any>('/landing/' + path).pipe(
      map(data => new LandingPageActions.LandingPageSuccess(data)),
      catchError(({ failedMessage }) => of(new LandingPageActions.LandingPageFailed(failedMessage)))
    );
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
