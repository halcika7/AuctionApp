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
    switchMap(() => this.helperFunction('featured'))
  );

  @Effect()
  featuredCollectionStart = this.actions$.pipe(
    ofType(LandingPageActions.FEATURED_COLLECTIONS_START),
    switchMap(() => this.helperFunction('featured/3'))
  );

  @Effect()
  newArrivalsProductStart = this.actions$.pipe(
    ofType(LandingPageActions.NEW_ARRIVALS_START),
    switchMap(() => this.helperFunction('newarrivals'))
  );

  @Effect()
  topRatedProductStart = this.actions$.pipe(
    ofType(LandingPageActions.TOP_RATED_START),
    switchMap(() => this.helperFunction('toprated'))
  );

  @Effect()
  lastChanceProductStart = this.actions$.pipe(
    ofType(LandingPageActions.LAST_CHANCE_START),
    switchMap(() => this.helperFunction('lastchance'))
  );

  @Effect()
  heroProduct = this.actions$.pipe(
    ofType(LandingPageActions.HERO_PRODUCT_START),
    switchMap(() => this.helperFunction('hero'))
  );

  @Effect()
  categories = this.actions$.pipe(
    ofType(LandingPageActions.CATEGORIES_START),
    switchMap(() => this.helperFunction('categories'))
  );

  helperFunction(path) {
    return this.http.get<any>('/landing/' + path).pipe(
      map(data => new LandingPageActions.LandingPageSuccess(data)),
      catchError(({ failedMessage }) => of(new LandingPageActions.LandingPageFailed(failedMessage)))
    );
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
