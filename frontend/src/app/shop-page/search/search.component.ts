import { EventEmitter, OnChanges } from "@angular/core";
import { Component, OnInit, Input, Output } from "@angular/core";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit, OnChanges {
  @Input() value: string;
  @Output() valueChanged = new EventEmitter<any>();
  private _inputValue: string | null = null;

  constructor() {}

  ngOnInit() {
    this._inputValue = this.value;
  }

  ngOnChanges() {
    this._inputValue = this.value;
  }

  onValueChange(e: Event, input: HTMLInputElement) {
    e.preventDefault();
    if (input.value != "") {
      this.valueChanged.emit(input.value);
    }
  }

  clearSearch() {
    this.valueChanged.emit(null);
  }

  get inputValue(): string | null {
    return this._inputValue;
  }
}
