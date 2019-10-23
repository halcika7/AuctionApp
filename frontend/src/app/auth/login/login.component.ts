import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string;
  showErrors = true;
  success = false;
  private remember: boolean;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(false)
    });

    this.store.dispatch(new AuthActions.AuthClearMessagess());

    this.store.select('auth').subscribe(({ errors, errorMessage, accessToken }) => {
      // tslint:disable-next-line: no-unused-expression
      errors.email && this.loginForm.controls.email.setErrors({ async: errors.email });
      // tslint:disable-next-line: no-unused-expression
      errors.password && this.loginForm.controls.password.setErrors({ async: errors.password });
      this.message = errorMessage ? errorMessage : '';
      if (accessToken) {
        this.showErrors = false;
        this.remember
          ? localStorage.setItem('accessToken', accessToken)
          : sessionStorage.setItem('accessToken', accessToken);
      }
    });
  }

  onSubmit() {
    this.showErrors = true;
    this.remember = this.loginForm.value.remember;
    this.loginForm.clearValidators();
    this.loginForm.markAsUntouched();
    this.store.dispatch(new AuthActions.LoginStart({ ...this.loginForm.value }));
  }

  removeMessages() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }
}
