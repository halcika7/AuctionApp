import { Component, OnDestroy } from "@angular/core";
import { Auth } from "@app/auth/auth";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { EMAIL_VALIDATOR, PASSWORD_VALIDATOR } from "../validators";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends Auth implements OnDestroy {
  constructor(
    private store: Store<fromApp.AppState>,
    protected router: Router
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

  ngOnDestroy() {
    super.destroy();
  }

  onSubmit() {
    this.store.dispatch(new AuthActions.LoginStart({ ...super.form.value }));
  }
}
