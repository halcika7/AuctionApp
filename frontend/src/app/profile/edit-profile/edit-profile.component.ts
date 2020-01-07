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
  PHONE_VALIDATOR
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
  private _gender: string;
  private _date: { day: number; year: number; month: string };
  private _isValidForm: boolean = false;
  private _clicked = false;
  private _showSpinner: boolean = false;
  private subscription = new Subscription();
  private _hasCard: boolean = false;
  private _validCard: boolean = true;

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
      ...BASIC_INPUT("cName"),
      ...BASIC_INPUT("cardNumber"),
      ...BASIC_INPUT("cardCvc"),
      ...BASIC_INPUT("cardExpiry"),
      ...BASIC_INPUT("street"),
      ...BASIC_INPUT("city"),
      ...BASIC_INPUT("zip"),
      ...BASIC_INPUT("country"),
      ...BASIC_INPUT("state"),
      ...BASIC_INPUT("image", null),
      ...BASIC_INPUT("changeCard", false)
    });

    this.stripe.mount();

    this.subscription.add(
      this.store.select("profile").subscribe(({ userInfo, errors }) => {
        this._clicked = false;
        this._showSpinner = false;
        if (!emptyObject(userInfo)) {
          this._validCard = userInfo.hasCard ? true : false;
          if (userInfo.hasCard) {
            this.form.controls.changeCard.setValue(false);
            this.stripe.clear();
          }
          this._date = !emptyObject(errors)
            ? this._date
            : { ...getYearMonthDay(buildDate(userInfo.dateOfBirth)) };

          this._gender = !emptyObject(errors) ? this._gender : userInfo.gender;
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

        this.checkForm();
      })
    );

    this.subscription.add(
      this.stripe.cardValidity.subscribe(data => {
        this._form.value.changeCard;
        if (data.valid && this.form.value.cName) {
          this._validCard = true;
        } else {
          this._validCard = false;
        }

        this.checkForm();
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

  checkForm() {
    if (this.form.value.changeCard) {
      this._isValidForm =
        this._isValidForm && this._validCard && this.form.value.cName;
    }
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

  get validCard(): boolean {
    return this._validCard;
  }

  get isValidForm(): boolean {
    return this._isValidForm;
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

    formData.append("name", this.form.value.cName);
    const { token = { id: "" } } = await this.stripe.create(
      this.form.value.cName
    );
    formData.append("token", token.id);
    formData.append("changeCard", this.form.value.changeCard);
    formData.append("userInfo", JSON.stringify(userInfo));
    formData.append("optionalInfo", JSON.stringify(optionalInfo));
    formData.append("image", this.form.value.image);
    this._clicked = true;
    this.store.dispatch(new ProfileActions.UpdateProfileStart(formData));
    window.scrollTo(0, 0);
    this._showSpinner = true;
  }
}
