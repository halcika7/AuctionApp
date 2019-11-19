import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { Auth } from "@app/auth/auth";

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
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern(
            new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,30})")
          )
        ])
      }),
      router
    );
    super.resetPassword = true;
  }

  ngOnInit() {
    if (!localStorage.getItem("resetPasswordToken")) {
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
        localStorage.getItem("resetPasswordToken"),
        super.form.controls.password.value
      )
    );
  }

  get isValidForm() {
    return this._isVaildForm;
  }
}
