import { Component, OnInit } from '@angular/core';
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
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  message: string;
  success: boolean;
  showErrors = true;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
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

    this.store.dispatch(new AuthActions.AuthClearMessagess());

    this.store
      .select('auth')
      .pipe(
        map(storeData => {
          delete storeData.accessToken;
          return { ...storeData };
        })
      )
      .subscribe(({ errors, successMessage, errorMessage }) => {
        // tslint:disable-next-line: no-unused-expression
        errors.email && this.signupForm.controls.email.setErrors({ async: errors.email });
        // tslint:disable-next-line: no-unused-expression
        errors.password && this.signupForm.controls.password.setErrors({ async: errors.password });
        // tslint:disable-next-line: no-unused-expression
        errors.firstName &&
          this.signupForm.controls.firstName.setErrors({ async: errors.firstName });
        // tslint:disable-next-line: no-unused-expression
        errors.lastName && this.signupForm.controls.lastName.setErrors({ async: errors.lastName });
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
        }
      });
  }

  onSubmit() {
    this.signupForm.clearValidators();
    this.signupForm.markAsUntouched();
    this.store.dispatch(new AuthActions.RegisterStart({ ...this.signupForm.value }));
  }

  removeMessages() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }
}
