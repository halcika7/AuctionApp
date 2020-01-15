import { Subscription } from "rxjs";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { AuthClearMessagess } from "@app/auth/store/auth.actions";
import { setErrors } from "@app/shared/validators";
import { UserWishlistIdsStart } from "@app/wishlist/store/wishlist.actions";
import { ClearProductMessages } from "@app/product-page/store/product-page.actions";
import { Renderer2 } from '@angular/core';

export class Auth {
  private _message: string;
  private _form: FormGroup;
  private _showErrors = true;
  private _success = false;
  private _isClicked = false;
  private _register = false;
  private _activateAccount = false;
  private _resetPassword = false;
  private _expiredToken: string;
  subscription: Subscription;

  constructor(
    private authStore: Store<any>,
    private Form: FormGroup,
    private Router: Router,
    private renderer: Renderer2
  ) {
    this.clearMessages();
    this._form = this.Form;
    this.subscription = this.authStore
      .select("auth")
      .subscribe(
        ({ errors, accessToken, message, resetTokenExpired, success }) => {
          if (
            accessToken ||
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken")
          ) {
            this.authStore.dispatch(new UserWishlistIdsStart());
            this.authStore.dispatch(new ClearProductMessages(true));
            this.subscription.unsubscribe();
            setTimeout(() => this.Router.navigate(["/home"]), 2000);
          }

          if (this.form.controls.email) {
            setErrors(errors, "email", this.form, message);
          }

          if (this.form.controls.password) {
            setErrors(errors, "password", this.form, message);
          }

          if (this._register) {
            setErrors(errors, "firstName", this.form, message);
            setErrors(errors, "lastName", this.form, message);
            setErrors(errors, "confirmPassword", this.form, message);
          }

          this._message = message;
          this._success = success;

          this._expiredToken = resetTokenExpired;

          if (this._success) {
            this._showErrors = false;
            this.renderer.addClass(document.body, "no-click");
            if(this._resetPassword || this._activateAccount) {
              setTimeout(
                () => this.Router.navigate(["/home/auth/login"]),
                2000
              )
            } else {
              setTimeout(() => this.Router.navigate(["/home"]), 2000);
            }
          } else {
            this.isClicked = false;
          }
        }
      );
  }

  destroy() {
    for (let control in this.form.controls) {
      this.form.controls[control].setErrors({});
      this.form.controls[control].markAsUntouched({});
    }
    this.subscription.unsubscribe();
    this.renderer.removeClass(document.body, "no-click");
  }

  clearMessages() {
    this.authStore.dispatch(new AuthClearMessagess());
  }

  get form() {
    return this._form;
  }

  get message(): string {
    return this._message;
  }

  get showErrors(): boolean {
    return this._showErrors;
  }

  get success(): boolean {
    return this._success;
  }

  set isClicked(val: boolean) {
    this._isClicked = val;
  }

  get isClicked(): boolean {
    return this._isClicked;
  }

  set register(val: boolean) {
    this._register = val;
  }

  set resetPassword(val: boolean) {
    this._resetPassword = val;
  }

  set activateAccount(val: boolean) {
    this._activateAccount = val;
  }

  get tokenExpired(): string {
    return this._expiredToken;
  }
}
