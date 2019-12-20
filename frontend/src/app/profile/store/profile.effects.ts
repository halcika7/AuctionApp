import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import * as ProfileActions from "./profile.actions";
import { LogoutStart, RefreshToken } from "@app/auth/store/auth.actions";
import { UserInfo, ProfileProduct, ProfileBid } from "./profile.reducer";

@Injectable()
export class ProfileEffects {
  @Effect()
  ProfileStart = this.actions$.pipe(
    ofType(ProfileActions.PROFILE_START),
    switchMap(({ url }) => {
      return this.http
        .get<{
          userInfo?: UserInfo;
          accessToken?: string;
          noMore?: boolean;
          products?: ProfileProduct[];
          bids?: ProfileBid[];
        }>(url)
        .pipe(
          map(data => {
            if (data.accessToken) {
              this.store.dispatch(
                new RefreshToken({ accessToken: data.accessToken })
              );
            }
            return new ProfileActions.ProfileSuccess(data);
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
            return of(new ProfileActions.ProfileFailed(data.error));
          })
        );
    })
  );

  @Effect()
  LoadMoreStart = this.actions$.pipe(
    ofType(ProfileActions.LOAD_MORE_PROFILE_START),
    switchMap(({ url }) => {
      return this.http
        .get<{
          accessToken?: string;
          noMore?: boolean;
          products?: ProfileProduct[];
          bids?: ProfileBid[];
        }>(url)
        .pipe(
          map(data => {
            if (data.accessToken) {
              this.store.dispatch(
                new RefreshToken({ accessToken: data.accessToken })
              );
            }
            return new ProfileActions.LoadMoreSuccess(data);
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
            return of(new ProfileActions.ProfileFailed(data.error));
          })
        );
    })
  );

  @Effect()
  UpdateProfileStart = this.actions$.pipe(
    ofType(ProfileActions.UPDATE_PROFILE_START),
    switchMap(({ formData }) => {
      return this.http
        .put<{
          accessToken?: string;
          message: string;
          userInfo: UserInfo;
        }>("/profile/updateprofile", formData)
        .pipe(
          map(data => {
            if (data.accessToken) {
              this.store.dispatch(
                new RefreshToken({ accessToken: data.accessToken })
              );
            }
            return new ProfileActions.UpdateProfileSuccess(data);
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
            return of(new ProfileActions.UpdateProfileFailed(data.error));
          })
        );
    })
  );

  @Effect()
  DeactivateAccount = this.actions$.pipe(
    ofType(ProfileActions.DEACTIVATE_ACCOUNT),
    switchMap(() => {
      return this.http.put<any>("/profile/deactivate", {}).pipe(
        map(() => new LogoutStart()),
        catchError(data => {
          if (data.error.accessToken) {
            this.store.dispatch(
              new RefreshToken({ accessToken: data.error.accessToken })
            );
          }
          if (data.error.authorizationError) {
            this.store.dispatch(new LogoutStart());
          }
          return of(new ProfileActions.ProfileFailed(data));
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
