import { Subscription } from "rxjs";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { AuthClearMessagess } from "@app/auth/store/auth.actions";

export class Auth {
  private _message: string;
  private _form: FormGroup;
  private _showErrors = true;
  private _success = false;
  private _isClicked = false;
  private _register = false;
  private _resetPassword = false;
  private _expiredToken: string;
  subscription: Subscription;

  constructor(
    private authStore: Store<any>,
    private Form: FormGroup,
    private Router: Router
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
            this.subscription.unsubscribe();
            setTimeout(() => this.Router.navigate(["/"]), 1200);
          }

          if (this.form.controls.email) {
            if (errors.email && !message) {
              this.form.controls.email.setErrors({ async: errors.email });
              this.form.controls.email.markAsTouched();
            } else {
              this.form.controls.email.setErrors({});
              this.form.controls.email.setValue(this.form.controls.email.value);
            }
          }

          if (this.form.controls.password) {
            if (errors.password && !message) {
              this.form.controls.password.setErrors({ async: errors.password });
              this.form.controls.password.markAsTouched();
            } else {
              this.form.controls.password.setErrors({});
              this.form.controls.password.setValue(
                this.form.controls.password.value
              );
            }
          }

          if (this._register) {
            if (errors.firstName && !message) {
              this.form.controls.firstName.setErrors({
                async: errors.firstName
              });
              this.form.controls.firstName.markAsTouched();
            } else {
              this.form.controls.firstName.setErrors({});
              this.form.controls.firstName.setValue(
                this.form.controls.firstName.value
              );
            }

            if (errors.lastName && !message) {
              this.form.controls.lastName.setErrors({ async: errors.lastName });
              this.form.controls.lastName.markAsTouched();
            } else {
              this.form.controls.lastName.setErrors({});
              this.form.controls.lastName.setValue(
                this.form.controls.lastName.value
              );
            }
          }

          this._message = message;
          this._success = success;

          this._expiredToken = resetTokenExpired;

          if (this._success) {
            this._showErrors = false;
            this.form.reset();
            this._register || this._resetPassword
              ? setTimeout(
                  () => this.Router.navigate(["/home/auth/login"]),
                  2000
                )
              : setTimeout(() => this.Router.navigate(["/home"]), 2000);
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

  get tokenExpired(): string {
    return this._expiredToken;
  }
}
