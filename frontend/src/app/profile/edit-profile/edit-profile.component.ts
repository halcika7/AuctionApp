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

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"]
})
export class EditProfileComponent implements OnInit, OnDestroy {
  private _form: FormGroup;
  private _gender: string;
  private _date: { day: number; year: number; month: string };
  private _cardEXP: { year: number; month: string } = { year: 0, month: "" };
  private _isValidForm: boolean = false;
  private _clicked = false;
  private subscription = new Subscription();

  constructor(
    private profileService: ProfileService,
    private store: Store<fromApp.AppState>
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
      ...CARD_FIELD("cNumber", {}),
      ...CARD_FIELD("CVC", { min: 3, max: 4 }),
      ...BASIC_INPUT("street"),
      ...BASIC_INPUT("city"),
      ...BASIC_INPUT("zip"),
      ...BASIC_INPUT("country"),
      ...BASIC_INPUT("state"),
      ...BASIC_INPUT("image", null)
    });
    this.subscription.add(
      this.store.select("profile").subscribe(({ userInfo, errors }) => {
        this._clicked = false;
        if (!emptyObject(userInfo)) {
          this._date = !emptyObject(errors)
            ? this._date
            : { ...getYearMonthDay(buildDate(userInfo.dateOfBirth)) };
          this._cardEXP = !emptyObject(errors)
            ? { ...this._cardEXP }
            : {
                year: userInfo.CardInfo.exp_year,
                month: userInfo.CardInfo.exp_month
              };
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

  get form(): FormGroup {
    return this._form;
  }

  get gender(): string {
    return this._gender;
  }

  get date() {
    return this._date;
  }

  get cardExp() {
    return this._cardEXP;
  }

  get clicked(): boolean {
    return this._clicked;
  }

  get isValidForm(): boolean {
    return this._isValidForm;
  }

  onSubmit() {
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
    console.log("TCL: onSubmit -> this._gender", this._gender);
    const optionalInfo = {
      street: this.form.value.street,
      city: this.form.value.city,
      country: this.form.value.country,
      zip: this.form.value.zip,
      state: this.form.value.state
    };
    const cardInfo = {
      number: this.form.value.cNumber,
      name: this.form.value.cName,
      cvc: this.form.value.CVC,
      exp_month: this._cardEXP.month,
      exp_year: this._cardEXP.year
    };
    formData.append("userInfo", JSON.stringify(userInfo));
    formData.append("optionalInfo", JSON.stringify(optionalInfo));
    formData.append("cardInfo", JSON.stringify(cardInfo));
    formData.append("image", this.form.value.image);
    this._clicked = true;
    this.store.dispatch(new ProfileActions.UpdateProfileStart(formData));
    window.scrollTo(0, 0);
  }
}
