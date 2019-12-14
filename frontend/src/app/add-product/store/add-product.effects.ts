import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, Effect } from "@ngrx/effects";
import * as AddProductActions from "./add-product.actions";
import { concatMap, map, catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class AddProductEffects {
  @Effect()
  addProductStart = this.actions$.pipe(
    ofType(AddProductActions.ADD_PRODUCT_START),
    concatMap(({ url }) => {
      return this.http.get<any>(url).pipe(
        map(resData => new AddProductActions.AddProductSuccess(resData)),
        catchError(({ error }) =>
          of(new AddProductActions.AddProductFailed(error))
        )
      );
    })
  );

  @Effect()
  addUserProductStart = this.actions$.pipe(
    ofType(AddProductActions.ADD_USER_PRODUCT_START),
    switchMap(({ formData }) => {
      return this.http.post<any>('/add-product/addproduct', formData).pipe(
        map(resData => new AddProductActions.AddProductSuccess(resData)),
        catchError(({ error }) =>
          of(new AddProductActions.AddProductFailed(error))
        )
      );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
