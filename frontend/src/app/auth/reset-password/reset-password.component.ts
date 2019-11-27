import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { Auth } from "@app/auth/auth";
import { PASSWORD_VALIDATOR } from '../validators';

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent extends Auth implements OnInit, OnDestroy {
  private _isVaildForm: boolean = false;
  private formSubscription: Subscription;
  constructor(private store: Store<fromApp.AppState>, private router: Router) {
    super(
      store,
      new FormGroup({
        ...PASSWORD_VALIDATOR()
      }),
      router
    );
    super.resetPassword = true;
  }

  ngOnInit() {
    if (!sessionStorage.getItem("resetPasswordToken")) {
      this.router.navigate(["/404"]);
    }
    this.formSubscription = super.form.statusChanges.subscribe(validity => {
      if (validity === "VALID") {
        this._isVaildForm = true;
      } else {
        this._isVaildForm = false;
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
    this.formSubscription.unsubscribe();
  }

  onSubmit() {
    super.isClicked = true;
    this.store.dispatch(
      new AuthActions.ResetPasswordStart(
        sessionStorage.getItem("resetPasswordToken"),
        super.form.controls.password.value
      )
    );
  }

  get isValidForm() {
    return this._isVaildForm;
  }
}
