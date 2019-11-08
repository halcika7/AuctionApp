import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as AuthActions from '@app/auth/store/auth.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private _signupForm: FormGroup;
  private _message: string;
  private _success: boolean;
  private _isValidForm = false;
  private _isClicked = false;
  private _showErrors = true;

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

    this.signupForm.statusChanges.subscribe(validity => {
      if (validity === 'VALID') {
        this.isValidForm = true;
      } else {
        this.isValidForm = false;
      }
    });

    this.store.select('auth').subscribe(({ errors, successMessage, errorMessage }) => {
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
        this.success = false;
      }

      if (successMessage) {
        this.showErrors = false;
        this.signupForm.reset();
        setTimeout(() => this.router.navigate(['/home/auth/login']), 2000);
      } else {
        this.isClicked = false;
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }

  onSubmit() {
    this.isClicked = true;
    this.store.dispatch(new AuthActions.RegisterStart({ ...this.signupForm.value }));
  }

  removeMessages() {
    this.store.dispatch(new AuthActions.AuthClearMessagess());
  }

  set signupForm(form: FormGroup) {
    this._signupForm = form;
  }

  get signupForm(): FormGroup {
    return this._signupForm;
  }

  set message(message: string) {
    this._message = message;
  }

  get message(): string {
    return this._message;
  }

  set success(val: boolean) {
    this._success = val;
  }

  get success(): boolean {
    return this._success;
  }

  set isValidForm(val: boolean) {
    this._isValidForm = val;
  }

  get isValidForm(): boolean {
    return this._isValidForm;
  }

  set isClicked(val: boolean) {
    this._isClicked = val;
  }

  get isClicked(): boolean {
    return this._isClicked;
  }

  set showErrors(val: boolean) {
    this._showErrors = val;
  }

  get showErrors(): boolean {
    return this._showErrors;
  }
}
