import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, Effect } from "@ngrx/effects";
import * as ShopPageActions from "@app/shop-page/store/shop-page.actions";
import { map, catchError, concatMap } from "rxjs/operators";
import { of } from "rxjs";
import { Brand, Filters, Prices } from "./shop-page.reducer";

interface dataInterface {
  Brands?: Brand[];
  Filters?: Filters[];
  Prices?: Prices;
  failedMessage?: string;
}

@Injectable()
export class ShopPageEffects {
  @Effect()
  shopStart = this.actions$.pipe(
    ofType(ShopPageActions.SHOP_PAGE_START),
    concatMap(({ url }) => {
      return this.http.get<dataInterface>(url).pipe(
        map(data => new ShopPageActions.ShopSuccess(data)),
        catchError(({ error }) =>
          of(new ShopPageActions.ShopFailed(error.failedMessage))
        )
      );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
