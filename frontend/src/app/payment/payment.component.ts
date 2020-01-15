import { isEmptyObject } from "@app/shared/isEmptyObject";
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
import { map } from "rxjs/operators";
import { OwnerInfo } from "@app/product-page/store/product-page.reducer";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent implements OnInit, OnDestroy {
  private productId: string;
  private _cardInfo: FormGroup = new FormGroup({
    ...BASIC_INPUT("cName"),
    ...BASIC_INPUT("cardNumber"),
    ...BASIC_INPUT("cardCvc"),
    ...BASIC_INPUT("cardExpiry")
  });
  private subcategoryId: string;
  private token: string;
  private _form: FormGroup;
  private _openRateUserModal: boolean = false;
  private _message: string;
  private _success: boolean;
  private _clicked: boolean;
  private _ownerInfo: OwnerInfo;
  private _previousRating: number;
  private _userRating: number;
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
      cardInfo: this._cardInfo
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
        const info = {
          productId: id,
          subcategoryId
        };

        this.store.dispatch(new PaymentPageActions.CheckUserValidity(info));

        this.store.dispatch(new PaymentPageActions.GetOwnerInfo(info));
      })
    );

    this.subscription.add(
      this.store
        .select("payment")
        .subscribe(({ message, success, ownerInfo, previousRating }) => {
          if (message == environment.PRODUCT_NOT_FOUND)
            this.router.navigate(["/404"]);
          this._message = message;
          this._success = success;
          this._clicked = false;
          this._ownerInfo = ownerInfo;
          this._previousRating = previousRating;

          if (success) {
            window.scrollTo(0, 0);
            setTimeout(() => {
              this.router.navigate(["/home"]);
            }, 4000);
          }
        })
    );

    this.subscription.add(
      this.store.select("addProduct").subscribe(({ errors }) => {
        this.setFormErrors(errors);
        this.windowScrolls(errors);
        this._clicked = false;
      })
    );
  }

  ngOnDestroy() {
    this.clearMessages();
    this.subscription.unsubscribe();
  }

  submitForm(token: string) {
    this.token = token;
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
      name: this._cardInfo.value.cName,
      token: this.token
    };
    this._userRating = value;
    this.store.dispatch(
      new PaymentPageActions.MakePayment({
        addressInformation,
        cardInformation,
        userRating: this._userRating,
        productId: this.productId,
        subcategoryId: this.subcategoryId
      })
    );
  }

  clearMessages() {
    this.store.dispatch(new PaymentPageActions.ClearPaymentMessages());
  }

  private setFormErrors(errors) {
    Object.keys(this._form.controls).forEach(key => {
      setErrors(errors, key, this._form);
    });
    if (errors.cName) {
      setErrors(errors, "cName", this._cardInfo);
    }
  }

  private windowScrolls(errors) {
    let elementId = "";
    if (isEmptyObject(errors)) {
      window.scrollTo(0, 0);
      return;
    } else if (errors.address) {
      elementId = "#address";
    } else if (errors.city || errors.country) {
      elementId = "#city";
    } else if (errors.zip) {
      elementId = "#zip";
    } else if (errors.phone) {
      elementId = "#phone";
    } else if (errors.card || errors.cName) {
      elementId = "#card-info";
    }

    if (elementId)
      document.querySelector(elementId).scrollIntoView({ behavior: "smooth" });
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

  get cardInfo(): FormGroup {
    return this._cardInfo;
  }

  get ownerInfo(): OwnerInfo {
    return this._ownerInfo;
  }

  get previousRating(): number {
    return this._previousRating;
  }

  get userRating(): number {
    return this._userRating;
  }
}
