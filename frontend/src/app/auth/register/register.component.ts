import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  message: string;
  success: boolean;
  showErrors = true;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
    this.signupForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(
          new RegExp(
            // tslint:disable-next-line: max-line-length
            '..[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?'
          )
        )
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(
          new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,30})')
        )
      ])
    });

    this.store
      .select('auth')
      .pipe(
        map(storeData => {
          delete storeData.accessToken;
          return { ...storeData };
        })
      )
      .subscribe(({ errors, successMessage, errorMessage }) => {
        if (errors.email && !errorMessage) {
          this.signupForm.controls.email.setErrors({ async: errors.email });
          this.signupForm.controls.email.markAsTouched();
        } else {
          this.signupForm.controls.email.setErrors({});
          this.signupForm.controls.email.setValue(this.signupForm.controls.email.value);
        }

        if (errors.password && !errorMessage) {
          this.signupForm.controls.password.setErrors({ async: errors.password });
          this.signupForm.controls.password.markAsTouched();
        } else {
          this.signupForm.controls.password.setErrors({});
          this.signupForm.controls.password.setValue(this.signupForm.controls.password.value);
        }

        if (errors.firstName && !errorMessage) {
          this.signupForm.controls.firstName.setErrors({ async: errors.firstName });
          this.signupForm.controls.firstName.markAsTouched();
        } else {
          this.signupForm.controls.firstName.setErrors({});
          this.signupForm.controls.firstName.setValue(this.signupForm.controls.firstName.value);
        }

        if (errors.lastName && !errorMessage) {
          this.signupForm.controls.lastName.setErrors({ async: errors.lastName });
          this.signupForm.controls.lastName.markAsTouched();
        } else {
          this.signupForm.controls.lastName.setErrors({});
          this.signupForm.controls.lastName.setValue(this.signupForm.controls.lastName.value);
        }

        if (successMessage || errorMessage) {
          this.message = successMessage ? successMessage : errorMessage;
          this.success = successMessage ? true : false;
        } else {
          this.message = '';
          this.success = null;
        }

        if (successMessage) {
          this.showErrors = false;
          this.signupForm.reset();

          setTimeout(() => {
            this.router.navigate(['/home/auth/login']);
          }, 2000);
        }
      });
  }

  ngOnDestroy() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }

  onSubmit() {
    this.store.dispatch(new AuthActions.RegisterStart({ ...this.signupForm.value }));
  }

  removeMessages() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }
}
