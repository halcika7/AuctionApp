import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as PaymentPageActions from "./store/payemnt.actions";
import { AddProductStart } from "@app/add-product/store/add-product.actions";
import {
  NAME_VALIDATOR,
  BASIC_INPUT,
  PHONE_VALIDATOR,
  setErrors
} from "../shared/validators";
import { Subscription } from "rxjs";
import { map } from 'rxjs/operators';

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent implements OnInit, OnDestroy {
  private productId: string;
  private subcategoryId: string;
  private _form: FormGroup;
  private _selectedYear: number;
  private _selectedMonth: string;
  private _openRateUserModal: boolean = false;
  private _message: string;
  private _success: boolean;
  private _clicked: boolean;
  private subscription = new Subscription();

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.dispatch(new AddProductStart("/add-product/optionalinfo"));

    this._form = new FormGroup({
      ...NAME_VALIDATOR("address"),
      ...NAME_VALIDATOR("country"),
      ...NAME_VALIDATOR("city"),
      ...NAME_VALIDATOR("zip", 5, 5),
      ...PHONE_VALIDATOR("phone", true),
      ...BASIC_INPUT("useCard", false),
      ...BASIC_INPUT("useOptionalInfo", false),
      ...BASIC_INPUT("cName"),
      ...BASIC_INPUT("cNumber"),
      ...BASIC_INPUT("CVC")
    });

    this.subscription.add(
      this.store
        .select("auth")
        .pipe(map(auth => auth.accessToken))
        .subscribe(accessToken => {
          if (
            !accessToken &&
            !localStorage.getItem("accessToken") &&
            !sessionStorage.getItem("accessToken")
            ) {
            this.router.navigate(["/home/auth/login"]);
          }
        })
    );

    this.subscription.add(
      this.route.params.subscribe(({ id, subcategoryId }: Params) => {
        if (!id || !subcategoryId) this.router.navigate(["/404"]);
        this.productId = id;
        this.subcategoryId = subcategoryId;

        this.store.dispatch(
          new PaymentPageActions.CheckUserValidity({
            productId: id,
            subcategoryId
          })
        );
      })
    );

    this.subscription.add(
      this.store.select("payment").subscribe(({ message, success }) => {
        if (message == "Product not found !") this.router.navigate(["/404"]);
        this._message = message;
        this._success = success;
        this._clicked = false

        if(success) {
          setTimeout(() => {
            this.router.navigate(["/home"]);
          }, 4000);
        }
      })
    );

    this.subscription.add(
      this.store
        .select("addProduct")
        .subscribe(
          ({ errors }) => {
            this.setFormErrors(errors);
            this._clicked = false;
          }
        )
    );
  }

  ngOnDestroy() {
    this.clearMessages();
    this.subscription.unsubscribe();
  }

  submitForm(data) {
    this._selectedYear = data.exp_year;
    this._selectedMonth = data.exp_month;
    this._openRateUserModal = true;
    this._clicked = true;
  }

  confirmOrder(value: number) {
    this._openRateUserModal = false;
    const addressInformation = {
      address: this.form.value.address,
      city: this.form.value.city,
      country: this.form.value.country,
      phone: this.form.value.phone,
      zip: this.form.value.zip
    };
    const cardInformation = {
      useCard: this.form.value.useCard,
      cvc: this.form.value.CVC,
      name: this.form.value.cName,
      number: this.form.value.cNumber,
      exp_year: this._selectedYear,
      exp_month: this._selectedMonth
    };
    const userRating = value;
    this.store.dispatch(
      new PaymentPageActions.MakePayment({
        addressInformation,
        cardInformation,
        userRating,
        productId: this.productId,
        subcategoryId: this.subcategoryId
      })
    );
  }

  clearMessages() {
    this.store.dispatch(new PaymentPageActions.ClearPaymentMessages())
  }

  private setFormErrors(errors) {
    Object.keys(this._form.controls).forEach(key => {
      setErrors(errors, key, this._form);
    });
  }

  get form(): FormGroup {
    return this._form;
  }

  get openRateUserModal(): boolean {
    return this._openRateUserModal;
  }

  get message(): string {
    return this._message;
  }

  get success(): boolean {
    return this._success;
  }

  get clicked(): boolean {
    return this._clicked;
  }
}
