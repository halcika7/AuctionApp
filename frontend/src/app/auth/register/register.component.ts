import { Component, OnInit, OnDestroy } from "@angular/core";
import { Auth } from "@app/auth/auth";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { Subscription } from "rxjs";
import {
  NAME_VALIDATOR,
  PASSWORD_VALIDATOR,
  EMAIL_VALIDATOR
} from "../validators";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent extends Auth implements OnInit, OnDestroy {
  private _isValidForm = false;
  private formSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {
    super(
      store,
      new FormGroup({
        ...NAME_VALIDATOR("firstName"),
        ...NAME_VALIDATOR("lastName"),
        ...PASSWORD_VALIDATOR(false, "password"),
        ...PASSWORD_VALIDATOR(false, "confirmPassword"),
        ...EMAIL_VALIDATOR()
      }),
      router
    );
    super.register = true;
  }

  ngOnInit() {
    this.formSubscription = super.form.statusChanges.subscribe(validity => {
      if (validity === "VALID") {
        this._isValidForm = true;
      } else {
        this._isValidForm = false;
      }
    });
  }

  ngOnDestroy() {
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
