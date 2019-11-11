import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthClearMessagess } from '@app/auth/store/auth.actions';

export class Auth {
  private _message: string;
  private _form: FormGroup;
  private _showErrors = true;
  private _success = false;
  private _isClicked = false;
  private _login = true;
  private subscription: Subscription;

  constructor(private authStore: Store<any>, private Form: FormGroup, private Router: Router) {
    this._form = this.Form;
    this.subscription = this.authStore
      .select('auth')
      .subscribe(({ errorMessage, errors, accessToken, successMessage }) => {
        if (
          accessToken ||
          localStorage.getItem('accessToken') ||
          sessionStorage.getItem('accessToken')
        ) {
          this.Router.navigate(['/']);
        }

        if (errors.email && !errorMessage) {
          this.form.controls.email.setErrors({ async: errors.email });
          this.form.controls.email.markAsTouched();
        } else {
          this.form.controls.email.setErrors({});
          this.form.controls.email.setValue(this.form.controls.email.value);
        }

        if (errors.password && !errorMessage) {
          this.form.controls.password.setErrors({ async: errors.password });
          this.form.controls.password.markAsTouched();
        } else {
          this.form.controls.password.setErrors({});
          this.form.controls.password.setValue(this.form.controls.password.value);
        }

        if (!this._login) {
          if (errors.firstName && !errorMessage) {
            this.form.controls.firstName.setErrors({ async: errors.firstName });
            this.form.controls.firstName.markAsTouched();
          } else {
            this.form.controls.firstName.setErrors({});
            this.form.controls.firstName.setValue(this.form.controls.firstName.value);
          }

          if (errors.lastName && !errorMessage) {
            this.form.controls.lastName.setErrors({ async: errors.lastName });
            this.form.controls.lastName.markAsTouched();
          } else {
            this.form.controls.lastName.setErrors({});
            this.form.controls.lastName.setValue(this.form.controls.lastName.value);
          }
        }

        if (successMessage || errorMessage) {
          this._message = successMessage ? successMessage : errorMessage;
          this._success = successMessage ? true : false;
        } else {
          this._message = '';
          this._success = false;
        }

        if (successMessage) {
          this._showErrors = false;
          this.form.reset();
          setTimeout(() => this.Router.navigate(['/home/auth/login']), 2000);
        } else {
          this.isClicked = false;
        }
      });
  }

  protected destroy() {
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

  set login(val: boolean) {
    this._login = val;
  }
}
