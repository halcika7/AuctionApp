import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-select-input",
  templateUrl: "./select-input.component.html",
  styleUrls: ["./select-input.component.scss"]
})
export class SelectInputComponent implements OnInit {
  @Input() values: any[];
  @Input() label: string;
  @Input() error: string;
  @Input() invalid: boolean;
  @Input() default: string;
  @Input() liWhenValuesLength0: string;
  @Output() valueChange = new EventEmitter<any>();
  private _selectedValue: any;

  constructor() {}

  ngOnInit() {
    this._selectedValue = this.default;
  }

  changeSelectedValue(value: any) {
    this._selectedValue = value;
    this.valueChange.emit(value);
  }

  get selectedValue(): any {
    return this._selectedValue;
  }
}
