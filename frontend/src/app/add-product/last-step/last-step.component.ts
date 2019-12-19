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
import { getNextFourYears, getMonthNumber } from "@app/shared/dateHelper";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";

@Component({
  selector: "app-last-step",
  templateUrl: "./last-step.component.html",
  styleUrls: ["./last-step.component.scss"]
})
export class LastStepComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() currentStep: number;
  @Output() submitForm = new EventEmitter<any>();
  private _isValidStep = false;
  private step: number = 3;
  private _years = getNextFourYears();
  private _months = getMonthNumber();
  private _selectedYear: number;
  private _selectedMonth: string;
  private _userInfo;
  private _phoneNumber: string;
  private _expYearError: string;
  private _expMonthError: string;
  private _cardError: string;
  private _showCard: boolean = true;
  private _hasCard: boolean = false;
  private _usingOptionslInfo: boolean = false;
  private subscription = new Subscription();

  constructor(
    private addProductService: AddProductService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this._showCard = !this.form.value.useCard;
    this.checkValidity();
    this.subscription.add(
      this.form.valueChanges.subscribe(({ useCard, useOptionalInfo }) => {
        const { cName, cNumber, CVC } = this.form.controls;
        if (this._usingOptionslInfo !== useOptionalInfo) {
          this._usingOptionslInfo = useOptionalInfo;
          this.patchValues();
        }
        if (this._showCard !== !useCard) {
          this._showCard = !useCard;
          if (useCard) {
            setValidators([cName, cNumber, CVC], "required")
            this._selectedYear = null;
            this._selectedMonth = null;
            this._expYearError = null;
            this._expMonthError = null;
          } else {
            clearValidators([cName, cNumber, CVC]);
          }
          updateValueAndValidity([cName, cNumber, CVC]);
        }
        this.checkValidity();
      })
    );
    this.subscription.add(
      this.store.select("addProduct").subscribe(({ userInfo, errors }) => {
        this._hasCard = userInfo.hasCard;
        this._userInfo = userInfo.OptionalInfo;
        this._phoneNumber = userInfo.phoneNumber;
        this._expYearError = errors.exp_year;
        this._expMonthError = errors.exp_month;
        this._cardError = errors.card;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buttonClicked() {
    this.addProductService.changeStepValue(this.step - 1);
    window.scrollTo(0, 0);
  }

  process() {
    this.submitForm.emit({
      exp_year: this.selectedYear,
      exp_month: this.selectedMonth
    });
  }

  sowUseSavedInfo(): boolean {
    return !isEmptyObject(this._userInfo);
  }

  changeSelectedYear(value: number) {
    this._selectedYear = value;
    this._expYearError = null;
  }

  changeSelectedMonth(value: string) {
    this._selectedMonth = value;
    this._expMonthError = null;
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
    const {
      address,
      country,
      city,
      zip,
      phone,
      cName,
      cNumber,
      CVC
    } = this.form.controls;
    let valid = partialFormValidity([address, country, city, zip, phone]);
    if (!this.form.controls.useCard) {
      valid = partialFormValidity([
        address,
        country,
        city,
        zip,
        phone,
        cName,
        cNumber,
        CVC
      ]);
    }
    this._isValidStep = valid;
  }

  get isValidStep(): boolean {
    return this._isValidStep;
  }

  get years(): number[] {
    return this._years;
  }

  get months(): string[] {
    return this._months;
  }

  get selectedYear(): number {
    return this._selectedYear;
  }

  get selectedMonth(): string {
    return this._selectedMonth;
  }

  get showCard(): boolean {
    return this._showCard;
  }

  get hasCard(): boolean {
    return this._hasCard;
  }

  get expYearError(): string {
    return this._expYearError;
  }

  get expMonthError(): string {
    return this._expMonthError;
  }

  get cardError(): string {
    return this._cardError;
  }

  get usingOptionslInfo(): boolean {
    return this._usingOptionslInfo;
  }
}
