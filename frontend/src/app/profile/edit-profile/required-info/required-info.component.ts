import { Component, OnInit, Output, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { emptyObject } from "@app/shared/checkEmptyObject";
import { setErrors } from "@app/shared/validators";

@Component({
  selector: "app-required-info",
  templateUrl: "./required-info.component.html",
  styleUrls: ["./required-info.component.scss"]
})
export class RequiredInfoComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() gender: string;
  @Input() date: { day: number; year: number; month: string };
  private _photo: string;
  private _genderError: string;
  private _dateError: string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select("profile").subscribe(({ userInfo, errors }) => {
      this._photo = userInfo.photo;
      if (!emptyObject(userInfo)) {
        this.form.patchValue({
          firstName: !emptyObject(errors)
            ? this.form.value.firstName
            : userInfo.firstName,
          lastName: !emptyObject(errors)
            ? this.form.value.lastName
            : userInfo.lastName,
          phoneNumber: !emptyObject(errors)
            ? this.form.value.phoneNumber
            : userInfo.phoneNumber,
          email: !emptyObject(errors)
            ? this.form.value.email
            : userInfo.email,
          image: !emptyObject(errors) ? this.form.value.image : null
        });
      }
      if (!emptyObject(errors)) {
        setErrors(errors, "firstName", this.form);
        setErrors(errors, "lastName", this.form);
        setErrors(errors, "email", this.form);
        setErrors(errors, "phoneNumber", this.form);
        this._genderError = errors.gender ? errors.gender : "";
        this._dateError = errors.dateOfBirth ? errors.dateOfBirth : "";
      }
    });
  }

  showDateOfBirth(): boolean {
    return !emptyObject(this.date);
  }

  genderChange(value: string) {
    this.gender = value;
  }

  get photo(): string {
    return this._photo;
  }

  get genderError(): string {
    return this._genderError;
  }

  get dateError(): string {
    return this._dateError;
  }
}