import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FullProduct } from './product-page.reducer';
import { Product } from '@app/landing-page/store/landing-page.reducers';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as ProductPageActions from './product-page.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ProductPageEffects {
  @Effect()
  ProductStart = this.actions$.pipe(
    ofType(ProductPageActions.PRODUCT_START),
    switchMap(({ id }) => {
      return this.http
        .get<{ product: FullProduct; similarProducts: Product[]; error?: string }>(
          `/products/${id}`
        )
        .pipe(
          map(data => new ProductPageActions.ProductSuccess(data)),
          catchError(data => of(new ProductPageActions.ProductFailed(data)))
        );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
