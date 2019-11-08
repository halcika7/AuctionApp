import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as AuthActions from '@app/auth/store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private _loginForm: FormGroup;
  private _message: string;
  private _showErrors = true;
  private _success = false;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(false)
    });

    this.store
      .select('auth')
      .pipe(map(storeData => storeData))
      .subscribe(({ errorMessage, errors, accessToken }) => {
        if (
          accessToken ||
          localStorage.getItem('accessToken') ||
          sessionStorage.getItem('accessToken')
        ) {
          this.router.navigate(['/']);
        }

        if (errors.email && !errorMessage) {
          this.loginForm.controls.email.setErrors({ async: errors.email });
          this.loginForm.controls.email.markAsTouched();
        } else {
          this.loginForm.controls.email.setErrors({});
          this.loginForm.controls.email.setValue(this.loginForm.controls.email.value);
        }

        if (errors.password && !errorMessage) {
          this.loginForm.controls.password.setErrors({ async: errors.password });
          this.loginForm.controls.password.markAsTouched();
        } else {
          this.loginForm.controls.password.setErrors({});
          this.loginForm.controls.password.setValue(this.loginForm.controls.password.value);
        }

        this.message = errorMessage ? errorMessage : '';
      });
  }

  onSubmit() {
    this.store.dispatch(new AuthActions.LoginStart({ ...this.loginForm.value }));
  }

  removeMessages() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }

  set loginForm(form: FormGroup) {
    this._loginForm = form;
  }

  get loginForm(): FormGroup {
    return this._loginForm;
  }

  set message(message: string) {
    this._message = message;
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
}
