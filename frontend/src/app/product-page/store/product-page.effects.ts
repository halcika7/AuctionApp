import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FullProduct, Bid } from "./product-page.reducer";
import { Store } from "@ngrx/store";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { Product } from "@app/landing-page/store/landing-page.reducers";
import * as ProductPageActions from "./product-page.actions";
import { LogoutStart, RefreshToken } from "@app/auth/store/auth.actions";

@Injectable()
export class ProductPageEffects {
  @Effect()
  ProductStart = this.actions$.pipe(
    ofType(ProductPageActions.PRODUCT_START),
    switchMap(({ id, subcategoryId }) => {
      return this.http
        .get<{ product: FullProduct; bids?: Bid[]; error?: string }>(`/products/${id}/${subcategoryId}`)
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
          map(data => {
            if (data.accessToken) {
              this.store.dispatch(new RefreshToken({ accessToken: data.accessToken }));
            }
            return new ProductPageActions.ProductBidSuccess(data);
          }),
          catchError(data => {
            if (data.accessToken) {
              this.store.dispatch(new RefreshToken({ accessToken: data.accessToken }));
            }
            if (data.error.authorizationError) {
              this.store.dispatch(new LogoutStart());
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
        .get<{ similarProducts: Product[] }>(`/products/similar/${productId}/${subcategoryId}`)
        .pipe(map(data => new ProductPageActions.SimilarProductSuccess(data)));
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<any>) {}
}
