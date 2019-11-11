import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from '@app/auth/auth.model';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as AuthActions from '@app/auth/store/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends Auth implements OnInit, OnDestroy {
  private _isValidForm = false;
  private formSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {
    super(
      store,
      new FormGroup({
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
      }),
      router
    );
    super.login = false;
  }

  ngOnInit() {
    super.clearMessages();
    this.formSubscription = super.form.statusChanges.subscribe(validity => {
      if (validity === 'VALID') {
        this._isValidForm = true;
      } else {
        this._isValidForm = false;
      }
    });
  }

  ngOnDestroy() {
    super.clearMessages();
    this.formSubscription.unsubscribe();
    super.destroy();
  }

  onSubmit() {
    super.isClicked = true;
    this.store.dispatch(new AuthActions.RegisterStart({ ...super.form.value }));
  }

  get isValidForm(): boolean {
    return this._isValidForm;
  }
}
