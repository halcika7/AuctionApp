import { Component, OnInit, OnDestroy } from "@angular/core";
import { Params, Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { Auth } from "./../auth";
import { jwtDecode } from "@app/shared/jwtDecode";
import { EMAIL_VALIDATOR } from "@app/shared/validators";
import { Renderer2 } from "@angular/core";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent extends Auth implements OnInit, OnDestroy {
  private _subscription = new Subscription();
  private _isVaildForm: boolean = false;
  private _reactivate: boolean = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private render: Renderer2
  ) {
    super(
      store,
      new FormGroup({
        ...EMAIL_VALIDATOR(true)
      }),
      router,
      render
    );
  }

  ngOnInit() {
    this._subscription.add(
      this.route.params.subscribe(({ token }: Params) => {
        if (token) {
          this.checkDateTokenValidity(token);
        } else if (this.router.url == "/home/auth/reactivate-account") {
          this._reactivate = true;
        }
      })
    );

    this.subscription.add(
      super.form.statusChanges.subscribe(validity => {
        if (validity === environment.VALID_FORM) {
          this._isVaildForm = true;
        } else {
          this._isVaildForm = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    super.destroy();
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }

  onSubmit() {
    super.isClicked = true;
    const url = !this._reactivate ? "/auth/forgotpassword" : "/auth/reactivate";
    const httpType = !this._reactivate ? "patch" : "post";
    this.store.dispatch(
      new AuthActions.ForgotPasswordStart(super.form.controls.email.value, url, httpType)
    );
  }

  private checkDateTokenValidity(token) {
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

  get isValidForm() {
    return this._isVaildForm;
  }

  get reactivate(): boolean {
    return this._reactivate;
  }
}
