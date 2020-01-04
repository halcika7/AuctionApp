import { Component, OnDestroy, OnInit } from "@angular/core";
import { Auth } from "@app/auth/auth";
import { FormGroup, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { EMAIL_VALIDATOR, PASSWORD_VALIDATOR } from "@app/shared/validators";
import { Subscription } from "rxjs";

import { environment as dev } from "@env/environment";
import { environment as prod } from "@env/environment.prod";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends Auth implements OnInit, OnDestroy {
  private _loginSubscription = new Subscription();
  private _url: string;

  constructor(
    private store: Store<fromApp.AppState>,
    protected router: Router,
    private route: ActivatedRoute
  ) {
    super(
      store,
      new FormGroup({
        ...EMAIL_VALIDATOR(true),
        ...PASSWORD_VALIDATOR(true),
        remember: new FormControl(false)
      }),
      router
    );
  }

  ngOnInit() {
    this._url = dev.production === false ? dev.apiUrl : prod.apiUrl;

    this._loginSubscription.add(
      this.route.queryParams.subscribe(({ token, message, remember, err }) => {
        if ((token && message && remember != null) || err) {
          this.router.navigate([], {
            queryParams: {
              token: null,
              message: null,
              remember: null,
              err: null
            },
            queryParamsHandling: "merge"
          });
        }

        if (err)
          this.store.dispatch(new AuthActions.AuthFailed({ message: err }));

        if (token && message && remember != null) {
          setTimeout(() => {
            this.store.dispatch(
              new AuthActions.LoginSuccess({
                message,
                remember,
                accessToken: token
              })
            );
          }, 500);
        }
      })
    );
  }

  ngOnDestroy() {
    super.destroy();
    this._loginSubscription.unsubscribe();
  }

  onSubmit() {
    this.store.dispatch(new AuthActions.LoginStart({ ...super.form.value }));
  }

  get url(): string {
    return this._url;
  }
}
