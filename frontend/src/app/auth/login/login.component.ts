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
  private remember: boolean;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      remember: new FormControl(null)
    });

    this.store.select('auth').subscribe(({ errors, errorMessage, accessToken }) => {
      if (errors.email || errors.password) {
        this.loginForm.controls.email.setErrors({ async: errors.email });
        this.loginForm.controls.password.setErrors({ async: errors.password });
      }
      if (errorMessage) {
        this.message = errorMessage;
      }
      if (accessToken) {
        if (this.remember) {
          localStorage.setItem('accessToken', accessToken);
        } else {
          sessionStorage.setItem('accessToken', accessToken);
        }
      }
    });
  }

  onSubmit() {
    this.remember = this.loginForm.value.remember;
    this.loginForm.clearValidators();
    this.loginForm.markAsUntouched();
    this.store.dispatch(new AuthActions.LoginStart({ ...this.loginForm.value }));
  }

  removeMessages() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }
}
