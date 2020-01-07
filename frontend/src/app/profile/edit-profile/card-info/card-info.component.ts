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
  @Input() cardError: string;
  private _hasCard: boolean;
  private _asyncCardValidation: string;
  private subscription = new Subscription();
  private _cardInfo;
  private _changeCard: boolean;
  _cardNumberError: string;
  _cardCvcError: string;
  _cardExpiryError: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private stripe: StripeServiceService
  ) {}

  ngOnInit() {
    const { cName, cardNumber, cardCvc, cardExpiry } = this.form.controls;
    this.subscription.add(
      this.store
        .select("profile")
        .subscribe(({ userInfo: { CardInfo, hasCard }, errors }) => {
          this._hasCard = hasCard;
          if (!this._hasCard) {
            this._changeCard = true;
          }
          this._cardInfo = CardInfo;
          this._asyncCardValidation = errors.card;
        })
    );

    this.subscription.add(
      this.form.controls.changeCard.valueChanges.subscribe(value => {
        this._changeCard = value;
        if (value) {
          setValidators(
            [cName, cardNumber, cardCvc, cardExpiry],
            ["cName", "cardNumber", "cardCvc", "cardExpiry"]
          );
        } else {
          clearValidators([cName, cardNumber, cardCvc, cardExpiry]);
        }
      })
    );

    this.subscription.add(
      this.stripe.cardData.subscribe(data => {
        this._cardNumberError = data.cardNumber.message;
        this._cardCvcError = data.cardCvc.message;
        this._cardExpiryError = data.cardExpiry.message;
      })
    );

    this.subscription.add(
      this.stripe.cardValidity.subscribe(data => {
        if(data.valid) {
          clearValidators([cardNumber, cardCvc, cardExpiry]);
          this.form.updateValueAndValidity();
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
