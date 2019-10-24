import { map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  message: string;
  showErrors = true;
  success = false;
  private remember: boolean;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(false)
    });

    this.store.select('auth').subscribe(({ errors, errorMessage, accessToken }) => {
      if (
        accessToken ||
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken')
      ) {
        this.remember
          ? localStorage.setItem('accessToken', accessToken)
          : sessionStorage.setItem('accessToken', accessToken);
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

  ngOnDestroy() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }

  onSubmit() {
    this.remember = this.loginForm.value.remember;
    this.store.dispatch(new AuthActions.LoginStart({ ...this.loginForm.value }));
  }

  removeMessages() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }
}
