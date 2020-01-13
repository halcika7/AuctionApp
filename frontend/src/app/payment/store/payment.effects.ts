import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, Effect } from "@ngrx/effects";
import * as PaymentPageActions from "@app/payment/store/payemnt.actions";
import { map, catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { LogoutStart, RefreshToken } from "@app/auth/store/auth.actions";
import { AddProductFailed } from "@app/add-product/store/add-product.actions";

@Injectable()
export class PaymentPageEffects {
  @Effect()
  checkUserStart = this.actions$.pipe(
    ofType(PaymentPageActions.CHECK_USER_VALIDITY),
    switchMap(({ data }) => {
      return this.http.post<any>("/payment/checkuservalidity", data).pipe(
        map(data => {
          if (data.accessToken) {
            this.store.dispatch(
              new RefreshToken({ accessToken: data.accessToken })
            );
          }
          return new PaymentPageActions.PaymentPageSuccess({});
        }),
        catchError(data => {
          if (data.accessToken) {
            this.store.dispatch(
              new RefreshToken({ accessToken: data.accessToken })
            );
          }
          if (data.error.authorizationError) {
            this.store.dispatch(new LogoutStart());
          }
          return of(new PaymentPageActions.PaymentPageFailed(data.error));
        })
      );
    })
  );

  @Effect()
  getOwnerInfo = this.actions$.pipe(
    ofType(PaymentPageActions.GET_OWNER_INFO),
    switchMap(({ data: { productId, subcategoryId } }) => {
      return this.http
        .get<any>(`/payment/ownerinfo/${productId}/${subcategoryId}`)
        .pipe(
          map(data => {
            if (data.accessToken) {
              this.store.dispatch(
                new RefreshToken({ accessToken: data.accessToken })
              );
            }
            return new PaymentPageActions.PaymentPageSuccess(data);
          }),
          catchError(data => {
            if (data.accessToken) {
              this.store.dispatch(
                new RefreshToken({ accessToken: data.accessToken })
              );
            }
            if (data.error.authorizationError) {
              this.store.dispatch(new LogoutStart());
            }
            return of(new PaymentPageActions.PaymentPageFailed(data.error));
          })
        );
    })
  );

  @Effect()
  makePayment = this.actions$.pipe(
    ofType(PaymentPageActions.MAKE_PAYMENT),
    switchMap(({ data }) => {
      return this.http.post<any>("/payment/makepayment", data).pipe(
        map(data => {
          if (data.accessToken) {
            this.store.dispatch(
              new RefreshToken({ accessToken: data.accessToken })
            );
          }
          return new PaymentPageActions.PaymentPageSuccess(data);
        }),
        catchError(data => {
          if (data.accessToken) {
            this.store.dispatch(
              new RefreshToken({ accessToken: data.accessToken })
            );
          }

          if (data.error.authorizationError) {
            this.store.dispatch(new LogoutStart());
          }

          if (data.error.errors) {
            const error = { errors: data.error.errors };
            this.store.dispatch(new AddProductFailed(error));
          }

          return of(new PaymentPageActions.PaymentPageFailed(data.error));
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
