import { Component, OnInit, OnDestroy } from "@angular/core";
import { Params, Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { Auth } from "./../auth";
import { jwtDecode } from "@app/shared/jwtDecode";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent extends Auth implements OnInit, OnDestroy {
  private _subscription = new Subscription();
  private _isVaildForm: boolean = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(
      store,
      new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email])
      }),
      router
    );
  }

  ngOnInit() {
    this._subscription.add(
      this.route.params.subscribe(({ token }: Params) => {
        if (token) {
          const decodedResetToken = jwtDecode(token);
          if (Object.keys(decodedResetToken).length === 0) {
            this.router.navigate(["/404"]);
          } else if (Date.now() > decodedResetToken.exp * 1000) {
            this.store.dispatch(new AuthActions.ResetTokenExpired());
            this.router.navigate(["/home/auth/forgot-password"]);
          } else if (Date.now() < decodedResetToken.exp * 1000) {
            sessionStorage.setItem("resetPasswordToken", token);
            this.router.navigate(["/home/auth/reset-password"]);
          }
        }
      })
    );

    this.subscription.add(
      super.form.statusChanges.subscribe(validity => {
        if (validity === "VALID") {
          this._isVaildForm = true;
        } else {
          this._isVaildForm = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }

  onSubmit() {
    super.isClicked = true;
    this.store.dispatch(new AuthActions.ForgotPasswordStart(super.form.controls.email.value));
  }

  get isValidForm() {
    return this._isVaildForm;
  }
}
