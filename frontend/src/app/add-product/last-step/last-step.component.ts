import { isEmptyObject } from "./../../shared/isEmptyObject";
import {
  setValidators,
  clearValidators,
  updateValueAndValidity
} from "@app/shared/validators";
import { partialFormValidity } from "@app/shared/partialFormValidity";
import { AddProductService } from "./../add-product.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { getNextFourYears, getMonthNumber } from "@app/shared/dateHelper";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";

@Component({
  selector: "app-last-step",
  templateUrl: "./last-step.component.html",
  styleUrls: ["./last-step.component.scss"]
})
export class LastStepComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() submitForm = new EventEmitter<any>();
  private _isValidStep = true;
  private step: number = 3;
  private _years = getNextFourYears();
  private _months = getMonthNumber();
  private _selectedYear: number;
  private _selectedMonth: string;
  private _showCard: boolean = true;
  private _hasCard: boolean = false;
  private _userInfo;
  private _phoneNumber: string;

  constructor(
    private addProductService: AddProductService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this._showCard = !this.form.value.useCard;
    // this.form.value.useOptionalInfo && this.patchValues();
    this.checkValidity();
    this.form.valueChanges.subscribe(data => {
      this._showCard = !data.useCard;
      this.patchValues();
      const { cName, cNumber, CVC } = this.form.controls;
      if (!data.useCard) {
        setValidators([cName, cNumber, CVC], "required");
      } else {
        clearValidators([cName, cNumber, CVC]);
        this._selectedYear = null;
        this._selectedMonth = null;
      }
      updateValueAndValidity([cName, cNumber, CVC]);
      this.checkValidity();
    });
    this.store.select("addProduct").subscribe(({ userInfo }) => {
      this._hasCard = userInfo.hasCard;
      this._userInfo = userInfo.OptionalInfo;
      this._phoneNumber = userInfo.phoneNumber;
    });
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

  private patchValues() {
    this.form.controls.address.patchValue(
      this.form.value.useOptionalInfo ? this._userInfo.street : "",
      {
        onlySelf: true
      }
    );
    this.form.controls.country.patchValue(
      this.form.value.useOptionalInfo ? this._userInfo.country : "",
      {
        onlySelf: true
      }
    );
    this.form.controls.city.patchValue(
      this.form.value.useOptionalInfo ? this._userInfo.city : "",
      { onlySelf: true }
    );
    this.form.controls.zip.patchValue(
      this.form.value.useOptionalInfo ? this._userInfo.zip : "",
      { onlySelf: true }
    );
    this.form.controls.phone.patchValue(
      this.form.value.useOptionalInfo ? this._phoneNumber : "",
      { onlySelf: true }
    );
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
    if (this.form.controls.featureProduct) {
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
}
