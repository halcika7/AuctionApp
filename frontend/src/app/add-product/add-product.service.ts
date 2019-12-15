import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AddProductService {
  buttonClicked = new Subject<number>();
  private _stepNumber: number = 0;

  constructor() {}

  changeStepValue(value: number) {
    this._stepNumber = value;
    this.buttonClicked.next(value);
  }

  get stepNumber(): number {
    return this._stepNumber;
  }

  set setStepNumber(value: number) {
    this._stepNumber = value;
  }
}
