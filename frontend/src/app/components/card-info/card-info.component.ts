import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { StripeServiceService } from "@app/shared/services/stripe-service.service";
import { setValidators, clearValidators } from "@app/shared/validators";

@Component({
  selector: "app-card-info",
  templateUrl: "./card-info.component.html",
  styleUrls: ["./card-info.component.scss"]
})
export class CardInfoComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() formGroup: FormGroup;
  @Input() cardError: string;
  @Input() className: string;
  @Input() required: boolean = false;
  @Input() showCard: boolean;
  private _hasCard: boolean;
  private _asyncCardValidation: string;
  private subscription = new Subscription();
  private _cardInfo;
  private _changeCard: boolean;
  private _cardUntouched: boolean = true;
  private _cardValid: boolean = false;
  _cardNumberError: string;
  _cardCvcError: string;
  _cardExpiryError: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private stripe: StripeServiceService
  ) {}

  ngOnInit() {
    const { cName, cardNumber, cardCvc, cardExpiry } = this.formGroup.controls;
    if (!this.showCard && this.required) {
      clearValidators([cName, cardNumber, cardCvc, cardExpiry]);
      return;
    }
    this.subscription.add(
      this.store
        .select("profile")
        .subscribe(({ userInfo: { CardInfo, hasCard }, errors }) => {
          this._hasCard = hasCard;
          if (!this._hasCard) {
            this._changeCard = true;
            this._cardValid = false;
          }
          this._cardInfo = CardInfo;
          this._asyncCardValidation = errors.card;
        })
    );

    this.subscription.add(
      this.store.select("addProduct").subscribe(({ userInfo, errors }) => {
        this._cardInfo = userInfo.CardInfo;
        this._asyncCardValidation = errors.card;
      })
    );

    if (!this.required) {
      this.subscription.add(
        this.formGroup.controls.changeCard.valueChanges.subscribe(value => {
          this._changeCard = value;
          if (!this._cardValid && this._changeCard) {
            setValidators(
              [cardNumber, cardCvc, cardExpiry],
              ["cardNumber", "cardCvc", "cardExpiry"]
            );
          } else {
            clearValidators([cardNumber, cardCvc, cardExpiry]);
          }
        })
      );
    }

    this.subscription.add(
      this.stripe.cardData.subscribe(data => {
        this._cardNumberError = data.cardNumber.message;
        this._cardCvcError = data.cardCvc.message;
        this._cardExpiryError = data.cardExpiry.message;
      })
    );

    this.subscription.add(
      this.stripe.cardValidity.subscribe(data => {
        if (
          (data.valid && this.formGroup.value.cName && !data.untouched) ||
          (data.untouched && !this.formGroup.value.cName)
        ) {
          clearValidators([cardNumber, cardCvc, cardExpiry]);
          this.formGroup.clearValidators();
          this.form.updateValueAndValidity();
        }

        this._cardValid =
          (data.valid && !this.hasCard) ||
          (data.valid && this.formGroup.value.cName && !data.untouched);
        this._cardUntouched = data.untouched;

        this.stripe.cardValid.next(
          this._cardValid &&
            this._cardUntouched == false &&
            this.formGroup.value.cName
        );

        if (!this.required) {
          if (!data.untouched || this.formGroup.value.cName) {
            this.formGroup.controls.changeCard.setValue(true);
          } else {
            this.formGroup.controls.changeCard.setValue(false);
          }
        }
      })
    );

    this.subscription.add(
      this.formGroup.controls.cName.valueChanges.subscribe(value => {
        if (!this._cardValid && (value || !this._cardUntouched)) {
          setValidators(
            [cardNumber, cardCvc, cardExpiry],
            ["cardNumber", "cardCvc", "cardExpiry"]
          );
          this.stripe.cardValid.next(
            this._cardValid &&
              this._cardUntouched == false &&
              this.formGroup.value.cName
          );
        } else {
          clearValidators([cardNumber, cardCvc, cardExpiry]);
          this.stripe.cardValid.next(true);
          this.formGroup.clearValidators();
          this.form.updateValueAndValidity();
        }

        if (!value && this._cardUntouched && this.changeCard) {
          this._changeCard = false;
          if (!this.required)
            this.formGroup.controls.changeCard.setValue(false);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get cardValidationError(): string {
    return this._asyncCardValidation;
  }

  get hasCard(): boolean {
    return this._hasCard;
  }

  get cardInfo() {
    return this._cardInfo;
  }

  get changeCard(): boolean {
    return this._changeCard;
  }
}
