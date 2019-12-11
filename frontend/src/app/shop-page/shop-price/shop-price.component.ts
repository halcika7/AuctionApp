import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { Options } from "ng5-slider";
import { MappedPriceRange } from "./../store/shop-page.reducer";

@Component({
  selector: "app-shop-price",
  templateUrl: "./shop-price.component.html",
  styleUrls: ["./shop-price.component.scss"]
})
export class ShopPriceComponent implements OnChanges {
  @Input() prices;
  @Input() priceRange: MappedPriceRange[];
  @Output() changeValues = new EventEmitter<any>();
  private _minValue: number;
  private _maxValue: number;
  private _options: Options = {
    floor: 0,
    ceil: 0,
    step: 0.1
  };

  constructor() {}

  ngOnChanges() {
    this._minValue = this.prices.min_price;
    this._maxValue = this.prices.max_price;
    this._options = {
      floor: this.minValue,
      ceil: this.maxValue,
      step: 0.1
    };
  }

  changePrice(data) {
    this.changeValues.emit(data);
  }

  get minValue(): number {
    return this._minValue;
  }

  get maxValue(): number {
    return this._maxValue;
  }

  get options(): Options {
    return this._options;
  }
}
