import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from '@app/auth/auth.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as AuthActions from '@app/auth/store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Auth implements OnDestroy {
  constructor(private store: Store<fromApp.AppState>, protected router: Router) {
    super(
      store,
      new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        remember: new FormControl(false)
      }),
      router
    );
  }

  ngOnDestroy() {
    super.destroy();
  }

  onSubmit() {
    this.store.dispatch(new AuthActions.LoginStart({ ...super.form.value }));
  }
}
