import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { setValidators, clearValidators } from "@app/shared/validators";
import { emptyObject } from "@app/shared/checkEmptyObject";

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
  @Input() cardExp;
  private _hasCard: boolean;
  private _asyncCardValidation: string;
  private subscription = new Subscription();
  private _cardInfo;
  private _changeCard: boolean;
  _cardNumberError: string;
  _cardCvcError: string;
  _cardExpiryError: string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    const { cName, cardNumber, cardCvc } = this.formGroup.controls;
    if (!this.showCard && this.required) {
      clearValidators([cName, cardNumber, cardCvc]);
      return;
    }
    this.subscription.add(
      this.store
        .select("profile")
        .subscribe(({ userInfo: { CardInfo, hasCard }, errors }) => {
          this._hasCard = hasCard;
          if (!hasCard) {
            this._changeCard = true;
          } else {
            this._changeCard = false;
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

    if(!this.required) {
      this.subscription.add(
        this.formGroup.controls.changeCard.valueChanges.subscribe(value => {
          this._changeCard = value;
          this.form.updateValueAndValidity({ onlySelf: true });
        })
      );
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showCardExp(): boolean {
    return !emptyObject(this.cardExp) && this.cardExp.year != null;
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
