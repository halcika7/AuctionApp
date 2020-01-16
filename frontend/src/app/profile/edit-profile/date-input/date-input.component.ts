import { FormGroup } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";
import {
  getYears,
  getNextFourYears,
  getMonths,
  getMonthDays,
  getMonthNumber
} from "@app/shared/dateHelper";
import { emptyObject } from "@app/shared/checkEmptyObject";
import { ProfileService } from "@app/profile/profile.service";
import { setValidators, clearValidators } from "@app/shared/validators";

@Component({
  selector: "app-date-input",
  templateUrl: "./date-input.component.html",
  styleUrls: ["./date-input.component.scss"]
})
export class DateInputComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() withDays: boolean;
  @Input() required: boolean = false;
  @Input() monthNumbers: boolean;
  @Input() label: string;
  @Input() error: string;
  @Input() id: string;
  @Input() defaultDate: { day: number; year: number; month: string } = {
    day: 0,
    year: 0,
    month: ""
  };
  private _months: string[] = [];
  private _days: number[] = [];
  private _years: number[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    if (!emptyObject(this.defaultDate)) {
      this._years = this.monthNumbers ? getNextFourYears() : getYears();
      this._months = this.monthNumbers ? getMonthNumber() : getMonths();
      if (this.withDays) {
        this.pushDays();
      }
    }
  }

  yearOnChange(value: number) {
    this.defaultDate.year = value;
    this.defaultDate.month = null;
    this.defaultDate.day = null;
    this.withDays && this.profileService.changeBirthDate(this.defaultDate);
    if (this.withDays) {
      this.pushDays();
    } else {
      setValidators([this.form.controls.cardExpiry], ["cardExpiry"]);
    }
  }

  monthOnChange(value: string) {
    this.defaultDate.month = value;
    this.defaultDate.day = null;
    this.withDays && this.profileService.changeBirthDate(this.defaultDate);
    if (this.withDays) {
      this.pushDays();
    } else {
      clearValidators([this.form.controls.cardExpiry]);
      this.form.controls.cardExpiry.setValue("   ");
    }
  }

  dayOnChange(value: number) {
    this.defaultDate.day = value;
    this.profileService.changeBirthDate(this.defaultDate);
  }

  pushDays(monthStr = this.defaultDate.month, year = this.defaultDate.year) {
    if (monthStr && year) {
      this._days = getMonthDays(monthStr, year);
    }
  }

  get years(): number[] {
    return this._years;
  }

  get months(): string[] {
    return this._months;
  }

  get days(): number[] {
    return this._days;
  }
}
