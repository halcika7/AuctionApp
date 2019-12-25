import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import * as WishlistActions from "./wishlist.actions";
import { LogoutStart, RefreshToken } from "@app/auth/store/auth.actions";

@Injectable()
export class WishlistEffects {
  @Effect()
  UserWishlistIdsStart = this.actions$.pipe(
    ofType(WishlistActions.USER_WISHLIST_IDS_START),
    switchMap(() => {
      return this.http
        .get<{ ids: string[]; accessToken?: string }>(
          `/wishlist/userwishlistids`
        )
        .pipe(
          map(data => {
            if (data.accessToken) {
              this.store.dispatch(
                new RefreshToken({ accessToken: data.accessToken })
              );
            }

            return new WishlistActions.UserWishlistIdsSuccess(data);
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

            return of(new WishlistActions.UserWishlistIdsFailed(data));
          })
        );
    })
  );

  @Effect()
  AddToWishlistStart = this.actions$.pipe(
    ofType(WishlistActions.ADD_TO_WISHLIST_START),
    switchMap(({ productId }) => {
      return this.http
        .post<{ ids: string[]; accessToken?: string }>(
          `/wishlist/addtowishlist`,
          { productId }
        )
        .pipe(
          map(data => {
            if (data.accessToken) {
              this.store.dispatch(
                new RefreshToken({ accessToken: data.accessToken })
              );
            }

            return new WishlistActions.UserWishlistIdsSuccess(data);
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

            return of(new WishlistActions.UserWishlistIdsFailed(data));
          })
        );
    })
  );

  @Effect()
  DeleteFromWishlistStart = this.actions$.pipe(
    ofType(WishlistActions.DELETE_FROM_WISHLIST_START),
    switchMap(({ productId }) => {
      return this.http
        .delete<{ ids: string[]; accessToken?: string }>(
          `/wishlist/removefromwishlist?productId=${productId}`
        )
        .pipe(
          map(data => {
            console.log("TCL: data", data);
            if (data.accessToken) {
              this.store.dispatch(
                new RefreshToken({ accessToken: data.accessToken })
              );
            }

            return new WishlistActions.UserWishlistIdsSuccess(data);
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

            return of(new WishlistActions.UserWishlistIdsFailed(data));
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
