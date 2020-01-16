import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";

@Component({
  selector: "app-select-input",
  templateUrl: "./select-input.component.html",
  styleUrls: ["./select-input.component.scss"]
})
export class SelectInputComponent implements OnInit, OnChanges {
  @Input() object: boolean = false;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() values: any[];
  @Input() label: string;
  @Input() error: string;
  @Input() invalid: boolean;
  @Input() default: string;
  @Input() liWhenValuesLength0: string;
  @Input() parentId: string;
  @Input() id: string;
  @Output() valueChange = new EventEmitter<any>();
  private _selectedValue: any;

  constructor() {}

  ngOnInit() {
    this._selectedValue = this.default;
  }

  ngOnChanges() {
    this._selectedValue = this.default;
  }

  changeSelectedValue(value: any, id: string = null) {
    this._selectedValue = value;
    if (id) {
      if (this.parentId) {
        this.valueChange.emit({ id, value, parentId: this.parentId });
      } else {
        this.valueChange.emit({ id, value });
      }
    } else {
      this.valueChange.emit(value);
    }
  }

  get selectedValue(): any {
    return this._selectedValue;
  }
}
