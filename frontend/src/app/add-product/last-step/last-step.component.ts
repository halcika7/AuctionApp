import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { isEmptyObject } from "@app/shared/isEmptyObject";
import {
  setValidators,
  clearValidators,
  updateValueAndValidity
} from "@app/shared/validators";
import { partialFormValidity } from "@app/shared/partialFormValidity";
import { AddProductService } from "./../add-product.service";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { StripeServiceService } from "@app/shared/services/stripe-service.service";

@Component({
  selector: "app-last-step",
  templateUrl: "./last-step.component.html",
  styleUrls: ["./last-step.component.scss"]
})
export class LastStepComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() nestedGroup: FormGroup;
  @Input() currentStep: number;
  @Input() payment: boolean = false;
  @Input() clicked: boolean = false;
  @Output() submitForm = new EventEmitter<any>();
  private _isValidStep = false;
  private step: number = 3;
  private _userInfo;
  private _phoneNumber: string;
  private _cardError: string;
  private _showCard: boolean = true;
  private _hasCard: boolean = false;
  private _usingOptionslInfo: boolean = false;
  private _validCard: boolean = false;
  private subscription = new Subscription();
  private _cardEXP: { year: number; month: string } = { year: 0, month: "" };

  constructor(
    private addProductService: AddProductService,
    private store: Store<fromApp.AppState>,
    private stripe: StripeServiceService
  ) {}

  ngOnInit() {
    this._showCard = !this.form.value.useCard;
    const {
      cName,
      cardNumber,
      cardCvc,
      cardExpiry
    } = this.nestedGroup.controls;

    if (this.showCard) {
      setValidators(
        [cName, cardNumber, cardCvc, cardExpiry],
        ["cName", "cardNumber", "cardCvc", "cardExpiry"]
      );
    }

    this.checkValidity();

    this.subscription.add(
      this.form.valueChanges.subscribe(({ useCard, useOptionalInfo }) => {
        if (this._usingOptionslInfo !== useOptionalInfo) {
          this._usingOptionslInfo = useOptionalInfo;
          this.patchValues();
        }

        if (this.showCard == useCard) {
          this._showCard = !useCard;
          if (!useCard) {
            setValidators(
              [cName, cardNumber, cardCvc, cardExpiry],
              ["cName", "cardNumber", "cardCvc", "cardExpiry"]
            );
          } else {
            clearValidators([cName, cardNumber, cardCvc, cardExpiry]);
            this._cardError = "";
          }
          updateValueAndValidity([cName, cardNumber, cardCvc, cardExpiry]);
        }
        this.checkValidity();
      })
    );

    this.subscription.add(
      this.store.select("addProduct").subscribe(({ userInfo, errors }) => {
        this._hasCard = userInfo.hasCard;
        this._userInfo = userInfo.OptionalInfo;
        this._phoneNumber = userInfo.phoneNumber;
        this._cardError = errors.card;
      })
    );

    this.subscription.add(this.nestedGroup.valueChanges.subscribe(vals => {
      this._cardError = "";
    }))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buttonClicked() {
    this.addProductService.changeStepValue(this.step - 1);
    window.scrollTo(0, 0);
  }

  async process() {
    this._isValidStep = false;
    let tokenId = '';
    if (this._showCard) {
      const { error, id } = await this.stripe.create(
        this.nestedGroup.value.cName,
        this.nestedGroup.value.cardNumber,
        this._cardEXP.month,
        this._cardEXP.year,
        this.nestedGroup.value.cardCvc
      );
      if (error) {
        this._cardError = error.message;
        return;
      }
      tokenId = id;
    }
    this.submitForm.emit(tokenId);
  }

  sowUseSavedInfo(): boolean {
    return !isEmptyObject(this._userInfo);
  }

  private patchValues() {
    this.form.patchValue({
      address: this.form.value.useOptionalInfo ? this._userInfo.street : "",
      country: this.form.value.useOptionalInfo ? this._userInfo.country : "",
      city: this.form.value.useOptionalInfo ? this._userInfo.city : "",
      zip: this.form.value.useOptionalInfo ? this._userInfo.zip : "",
      phone: this.form.value.useOptionalInfo ? this._phoneNumber : ""
    });

    this.form.updateValueAndValidity();
  }

  private checkValidity() {
    const { address, country, city, zip, phone } = this.form.controls;
    const { cName } = this.nestedGroup.controls;
    let valid = partialFormValidity([address, country, city, zip, phone]);
    if (!this.form.value.useCard) {
      valid =
        partialFormValidity([address, country, city, zip, phone, cName]) &&
        this.nestedGroup.valid &&
        !this._cardError;
    }
    this._isValidStep = valid;
  }

  get isValidStep(): boolean {
    return this._isValidStep;
  }

  get showCard(): boolean {
    return this._showCard;
  }

  get hasCard(): boolean {
    return this._hasCard;
  }

  get cardError(): string {
    return this._cardError;
  }

  get usingOptionslInfo(): boolean {
    return this._usingOptionslInfo;
  }

  get cardExp() {
    return this._cardEXP;
  }
}
