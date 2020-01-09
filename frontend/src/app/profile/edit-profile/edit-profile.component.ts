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
    ...CARD_FIELD("cardExpiry", { min: 4, max: 4 })
  });
  private _gender: string;
  private _date: { day: number; year: number; month: string };
  private _isValidForm: boolean = false;
  private _clicked = false;
  private _showSpinner: boolean = false;
  private subscription = new Subscription();
  private _hasCard: boolean = false;
  private _validCard: boolean;
  private _cardError: string;

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

    this.stripe.createElements();

    this.subscription.add(
      this.store.select("profile").subscribe(({ userInfo, errors }) => {
        this._clicked = false;
        this._showSpinner = false;
        if (!emptyObject(userInfo)) {
          this._validCard = userInfo.hasCard ? true : false;

          if (userInfo.hasCard) {
            this.cardInfo.controls.changeCard.setValue(false);
          }

          if (userInfo.hasCard && !errors.card) {
            this.cardInfo.controls.cName.setValue("");
            this.stripe.clear();
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
            this.scrollWindow(350);
          } else if (lastName) {
            this.scrollWindow(460);
          } else if (gender) {
            this.scrollWindow(560);
          } else if (dateOfBirth) {
            this.scrollWindow(660);
          } else if (phoneNumber) {
            this.scrollWindow(750);
          } else if (email) {
            this.scrollWindow(840);
          } else if (card) {
            this.scrollWindow(1000);
          }
        } else {
          this._cardError = "";
        }
      })
    );

    this.subscription.add(
      this.form.statusChanges.subscribe(validity => {
        if (validity === "VALID") {
          this._isValidForm = true;
        } else {
          this._isValidForm = false;
        }
      })
    );

    this.subscription.add(
      this.stripe.cardValid.subscribe(value => {
        this._validCard = value;
      })
    );
  }

  ngOnDestroy() {
    this.stripe.unmount();
    this.subscription.unsubscribe();
    this.store.dispatch(new ProfileActions.ClearProfile());
    this.store.dispatch(new ProfileActions.ClearProfileMessages());
  }

  changeGender(value: string) {
    this._gender = value;
  }

  private scrollWindow(value: number) {
    window.scrollTo(0, value);
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

    if (this._validCard) {
      formData.append("name", this.form.value.cardInfo.cName);
      const { token = { id: "" }, error } = await this.stripe.create(
        this.form.value.cardInfo.cName
      );
      if (error) {
        this._cardError = error.message;
        return false;
      }
      formData.append("token", token.id);
      formData.append("changeCard", this.form.value.cardInfo.changeCard);
    }
    formData.append("userInfo", JSON.stringify(userInfo));
    formData.append("optionalInfo", JSON.stringify(optionalInfo));
    formData.append("image", this.form.value.image);
    this._clicked = true;
    this.store.dispatch(new ProfileActions.UpdateProfileStart(formData));
    window.scrollTo(0, 0);
    this._showSpinner = true;
  }
}
