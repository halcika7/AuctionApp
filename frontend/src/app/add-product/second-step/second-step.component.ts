import { partialFormValidity } from "@app/shared/partialFormValidity";
import { AddProductService } from "./../add-product.service";
import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  validateStartDate,
  validateEndDate,
  compareStartEndDates
} from "@app/shared/compareStartEndDates";

@Component({
  selector: "app-second-step",
  templateUrl: "./second-step.component.html",
  styleUrls: ["./second-step.component.scss"]
})
export class SecondStepComponent implements OnInit {
  @Input() form: FormGroup;
  private _isValidStep = false;
  private step: number = 2;

  constructor(private addProductService: AddProductService) {}

  ngOnInit() {
    this.form.valueChanges.subscribe(({ startDate, endDate, price }) => {
      if (startDate) {
        !validateStartDate(startDate) &&
          this.form.controls.startDate.setErrors({ today: true });
      }
      if (endDate) {
        !validateEndDate(endDate) &&
          this.form.controls.endDate.setErrors({ tomorrow: true });
      }
      if (startDate && endDate) {
        !compareStartEndDates(startDate, endDate) &&
          this.form.controls.endDate.setErrors({ gthenStart: true });
      }

      this.checkValidity();
    });
    this.checkValidity();
  }

  buttonClicked(prev = true) {
    const value = prev ? this.step - 1 : this.step + 1;
    this.addProductService.changeStepValue(value);
    window.scrollTo(0, 0);
  }

  get isValidStep(): boolean {
    return this._isValidStep;
  }

  private checkValidity() {
    const { startDate, endDate, price } = this.form.controls;
    this._isValidStep = partialFormValidity([startDate, endDate, price]);
  }
}
