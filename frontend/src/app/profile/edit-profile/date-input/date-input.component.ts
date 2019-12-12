import { getMonthNumber } from './../../../shared/dateHelper';
import { Component, OnInit, Input } from "@angular/core";
import { getYears, getNextFourYears, getMonths, getMonthDays } from "@app/shared/dateHelper";
import { emptyObject } from "@app/shared/checkEmptyObject";

@Component({
  selector: "app-date-input",
  templateUrl: "./date-input.component.html",
  styleUrls: ["./date-input.component.scss"]
})
export class DateInputComponent implements OnInit {
  @Input() withDays: boolean;
  @Input() monthNumbers: boolean;
  @Input() label: string;
  @Input() error: string;
  @Input() defaultDate: { day: number; year: number; month: string } = {
    day: 0,
    year: 0,
    month: ""
  };
  private _months: string[] = [];
  private _days: number[] = [];
  private _years: number[] = [];

  constructor() {}

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
    if (this.withDays) {
      this.pushDays();
    }
  }

  monthOnChange(value: string) {
    this.defaultDate.month = value;
    if (this.withDays) {
      this.pushDays();
    }
  }

  pushDays(monthStr = this.defaultDate.month, year = this.defaultDate.year) {
    if (monthStr && year) {
      this._days = getMonthDays(monthStr, year);
    }
  }

  dayOnChange(value: number) {
    this.defaultDate.day = value;
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
