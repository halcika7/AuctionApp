import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, Effect } from "@ngrx/effects";
import * as AddProductActions from "./add-product.actions";
import { concatMap, map, catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { LogoutStart, RefreshToken } from "@app/auth/store/auth.actions";
import { Store } from "@ngrx/store";

@Injectable()
export class AddProductEffects {
  @Effect()
  addProductStart = this.actions$.pipe(
    ofType(AddProductActions.ADD_PRODUCT_START),
    concatMap(({ url }) => {
      return this.http.get<any>(url).pipe(
        map(resData => {
          if (resData.accessToken) {
            this.store.dispatch(
              new RefreshToken({ accessToken: resData.accessToken })
            );
          }
          return new AddProductActions.AddProductSuccess(resData);
        }),
        catchError(data => {
          if (data.error.accessToken) {
            this.store.dispatch(
              new RefreshToken({ accessToken: data.error.accessToken })
            );
          }
          if (data.error.authorizationError) {
            this.store.dispatch(new LogoutStart());
          }
          return of(new AddProductActions.AddProductFailed(data.error));
        })
      );
    })
  );

  @Effect()
  addUserProductStart = this.actions$.pipe(
    ofType(AddProductActions.ADD_USER_PRODUCT_START),
    switchMap(({ formData }) => {
      return this.http.post<any>("/add-product/addproduct", formData).pipe(
        map(resData => {
          if (resData.accessToken) {
            this.store.dispatch(
              new RefreshToken({ accessToken: resData.accessToken })
            );
          }
          return new AddProductActions.AddProductSuccess(resData);
        }),
        catchError(data => {
          if (data.error.accessToken) {
            this.store.dispatch(
              new RefreshToken({ accessToken: data.error.accessToken })
            );
          }
          if (data.error.authorizationError) {
            this.store.dispatch(new LogoutStart());
          }
          return of(new AddProductActions.AddProductFailed(data.error));
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<any>
  ) {}
}
