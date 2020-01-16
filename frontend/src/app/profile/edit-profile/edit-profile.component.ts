import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { ProfileService } from "./../profile.service";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as ProfileActions from "../store/profile.actions";
import { emptyObject } from "@app/shared/checkEmptyObject";
import {
  EMAIL_VALIDATOR,
  NAME_VALIDATOR,
  BASIC_INPUT,
  PHONE_VALIDATOR,
  CARD_FIELD
} from "@app/shared/validators";
import { buildDate, getYearMonthDay } from "@app/shared/dateHelper";
import { StripeServiceService } from "@app/shared/services/stripe-service.service";
import { environment } from "../../../environments/environment";
import { setValidators, clearValidators } from "@app/shared/validators";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"]
})
export class EditProfileComponent implements OnInit, OnDestroy {
  private _form: FormGroup;
  private cardInfo: FormGroup = new FormGroup({
    ...BASIC_INPUT("changeCard", false),
    ...CARD_FIELD("cName", { max: 100, min: 1 }),
    ...CARD_FIELD("cardNumber", {}),
    ...CARD_FIELD("cardCvc", { min: 3, max: 4 }),
    ...CARD_FIELD("cardExpiry", { min: 3, max: 4 })
  });
  private _gender: string;
  private _date: { day: number; year: number; month: string };
  private _isValidForm: boolean = false;
  private _clicked = false;
  private _showSpinner: boolean = false;
  private subscription = new Subscription();
  private _hasCard: boolean = false;
  private _cardError: string;
  private _cardEXP: { year: number; month: string } = { year: 0, month: "" };
  private changeCard: boolean;

  constructor(
    private profileService: ProfileService,
    private store: Store<fromApp.AppState>,
    private stripe: StripeServiceService
  ) {}

  ngOnInit() {
    this.profileService.changeBreadcrumb("Edit Profile");
    this.store.dispatch(new ProfileActions.ProfileStart("/profile/userInfo"));
    this._form = new FormGroup({
      ...NAME_VALIDATOR("firstName"),
      ...NAME_VALIDATOR("lastName"),
      ...EMAIL_VALIDATOR(true),
      ...PHONE_VALIDATOR("phoneNumber"),
      ...BASIC_INPUT("street"),
      ...BASIC_INPUT("city"),
      ...BASIC_INPUT("zip"),
      ...BASIC_INPUT("country"),
      ...BASIC_INPUT("state"),
      ...BASIC_INPUT("image", null),
      cardInfo: this.cardInfo
    });

    this.subscription.add(
      this.store.select("profile").subscribe(({ userInfo, errors }) => {
        this._clicked = false;
        this._showSpinner = false;
        if (!emptyObject(userInfo)) {
          if (userInfo.hasCard) {
            this.cardInfo.controls.changeCard.setValue(false);
            this.changeCard = false;
          }

          if (userInfo.hasCard && !errors.card) {
            this.cardInfo.controls.cName.setValue("");
          }

          this._date = !emptyObject(errors)
            ? this._date
            : { ...getYearMonthDay(buildDate(userInfo.dateOfBirth)) };

          this._gender = !emptyObject(errors) ? this._gender : userInfo.gender;
        }

        if (!emptyObject(errors)) {
          const {
            firstName,
            lastName,
            gender,
            email,
            phoneNumber,
            dateOfBirth,
            card
          } = errors;
          if (firstName) {
            this.scrollWindow("#firstName");
          } else if (lastName) {
            this.scrollWindow("#lastName");
          } else if (gender) {
            this.scrollWindow("#gender");
          } else if (dateOfBirth) {
            this.scrollWindow("#dateOfBirth");
          } else if (phoneNumber) {
            this.scrollWindow("#phoneNumber");
          } else if (email) {
            this.scrollWindow("#email");
          } else if (card) {
            this.scrollWindow("#card-info");
          }
        } else {
          this.clearCardValidators();
          this._form.reset();
          this._cardEXP = { year: 0, month: "" };
          this._cardError = "";
          window.scrollTo(0, 0);
        }
      })
    );

    this.subscription.add(
      this.cardInfo.valueChanges.subscribe(
        ({ changeCard, cName, cardNumber, cardCvc }) => {
          if (
            cName ||
            cardNumber ||
            cardCvc ||
            this._cardEXP.year ||
            this._cardEXP.month ||
            changeCard
          ) {
            this.changeCard = true;
          } else {
            this.changeCard = false;
          }
          if (this.changeCard || changeCard) {
            setValidators(
              [
                this.cardInfo.controls.cName,
                this.cardInfo.controls.cardNumber,
                this.cardInfo.controls.cardExpiry,
                this.cardInfo.controls.cardCvc
              ],
              ["cName", "cardNumber", "cardCvc", "cardExpiry"]
            );
          } else {
            this.clearCardValidators();
          }
        }
      )
    );

    this.subscription.add(
      this.form.statusChanges.subscribe(validity => {
        this.cardInfo.updateValueAndValidity({ onlySelf: true });
        if (
          validity === environment.VALID_FORM &&
          this.cardInfo.status === environment.VALID_FORM
        ) {
          this._isValidForm = true;
        } else {
          this._isValidForm = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ProfileActions.ClearProfile());
    this.store.dispatch(new ProfileActions.ClearProfileMessages());
  }

  changeGender(value: string) {
    this._gender = value;
  }

  private scrollWindow(id: string) {
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }

  private clearCardValidators() {
    clearValidators([
      this.cardInfo.controls.cName,
      this.cardInfo.controls.cardNumber,
      this.cardInfo.controls.cardExpiry,
      this.cardInfo.controls.cardCvc
    ]);
  }

  get form(): FormGroup {
    return this._form;
  }

  get gender(): string {
    return this._gender;
  }

  get date() {
    return this._date;
  }

  get clicked(): boolean {
    return this._clicked;
  }

  get showSpinner(): boolean {
    return this._showSpinner;
  }

  get hasCard(): boolean {
    return this._hasCard;
  }

  get isValidForm(): boolean {
    return this._isValidForm;
  }

  get cardError(): string {
    return this._cardError;
  }

  get cardExp() {
    return this._cardEXP;
  }

  async onSubmit() {
    const formData = new FormData();
    const userInfo = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      phoneNumber: this.form.value.phoneNumber,
      gender: this._gender,
      dateOfBirth: new Date(
        `${this._date.year}-${this._date.month}-${this._date.day}`
      )
    };
    const optionalInfo = {
      street: this.form.value.street,
      city: this.form.value.city,
      country: this.form.value.country,
      zip: this.form.value.zip,
      state: this.form.value.state
    };

    if (this.changeCard) {
      formData.append("name", this.cardInfo.value.cName);
      const { error, id } = await this.stripe.create(
        this.cardInfo.value.cName,
        this.cardInfo.value.cardNumber,
        this._cardEXP.month,
        this._cardEXP.year,
        this.cardInfo.value.cardCvc
      );
      if (error) {
        this._cardError = error.message;
        this.scrollWindow("#card-info");
        return false;
      }
      formData.append("token", id);
      formData.append("changeCard", this.cardInfo.value.changeCard);
    }
    formData.append("userInfo", JSON.stringify(userInfo));
    formData.append("optionalInfo", JSON.stringify(optionalInfo));
    formData.append("image", this.form.value.image);
    this._clicked = true;
    this.store.dispatch(new ProfileActions.UpdateProfileStart(formData));
    this._showSpinner = true;
  }
}
