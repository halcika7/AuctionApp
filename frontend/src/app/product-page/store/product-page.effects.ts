import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FullProduct, Bid } from "./product-page.reducer";
import { Product } from "@app/landing-page/store/landing-page.reducers";
import { Actions, ofType, Effect } from "@ngrx/effects";
import * as ProductPageActions from "./product-page.actions";
import { LogoutStart } from "@app/auth/store/auth.actions";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class ProductPageEffects {
  @Effect()
  ProductStart = this.actions$.pipe(
    ofType(ProductPageActions.PRODUCT_START),
    switchMap(({ id }) => {
      return this.http
        .get<{ product: FullProduct; bids?: Bid[]; error?: string }>(
          `/products/${id}`
        )
        .pipe(
          map(data => new ProductPageActions.ProductSuccess(data)),
          catchError(data => of(new ProductPageActions.ProductFailed(data)))
        );
    })
  );

  @Effect()
  ProductBidStart = this.actions$.pipe(
    ofType(ProductPageActions.PRODUCT_BID_START),
    switchMap(({ productId, bid }) => {
      return this.http
        .post<any>("/bids/make", { productId, bid })
        .pipe(
          map(data => new ProductPageActions.ProductBidSuccess(data)),
          catchError(data => {
            if (data.error.authorizationError) {
              return of(new LogoutStart());
            }
            return of(new ProductPageActions.ProductBidFailed(data));
          })
        );
    })
  );

  @Effect()
  similarProducts = this.actions$.pipe(
    ofType(ProductPageActions.SIMILAR_PRODUCT_START),
    switchMap(({ productId, subcategoryId }) => {
      return this.http
        .get<{ similarProducts: Product[] }>(
          `/products/${productId}/${subcategoryId}`
        )
        .pipe(map(data => new ProductPageActions.SimilarProductSuccess(data)));
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
