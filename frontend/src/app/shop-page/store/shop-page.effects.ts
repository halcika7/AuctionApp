import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, Effect } from "@ngrx/effects";
import * as ShopPageActions from "@app/shop-page/store/shop-page.actions";
import { map, catchError, concatMap } from "rxjs/operators";
import { of } from "rxjs";
import { Brand, Filters, Prices, PriceRange } from "./shop-page.reducer";
import { Product } from '@app/landing-page/store/landing-page.reducers';

interface dataInterface {
  Brands?: Brand[];
  Filters?: Filters[];
  Prices?: Prices;
  failedMessage?: string;
  products?: Product[];
  noMore?: boolean;
  priceRange?: PriceRange[];
}

@Injectable()
export class ShopPageEffects {
  @Effect()
  shopStart = this.actions$.pipe(
    ofType(ShopPageActions.SHOP_PAGE_START),
    concatMap(({ url }) => {
      return this.http.get<dataInterface>(url).pipe(
        map(data => {
          return new ShopPageActions.ShopSuccess(data);
        }),
        catchError(({ error }) =>
          of(new ShopPageActions.ShopFailed(error.failedMessage))
        )
      );
    })
  );

  @Effect()
  shopLoadMore = this.actions$.pipe(
    ofType(ShopPageActions.SHOP_PAGE_LOAD_MORE_START),
    concatMap(({ url }) => {
      return this.http.get<dataInterface>(url).pipe(
        map(data => {
          return new ShopPageActions.ShopPageLoadMoreSuccess(data);
        }),
        catchError(({ error }) =>
          of(new ShopPageActions.ShopFailed(error.failedMessage))
        )
      );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
