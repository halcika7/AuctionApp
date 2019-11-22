import { Component, OnInit } from "@angular/core";
import { Options } from "ng5-slider";

@Component({
  selector: "app-shop-page",
  templateUrl: "./shop-page.component.html",
  styleUrls: ["./shop-page.component.scss"]
})
export class ShopPageComponent implements OnInit {
  productsLayout = 'three-cols auto';
  minValue: number = 10;
  maxValue: number = 90;
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 0.1
  };

  constructor() {}

  ngOnInit() {}

  changeProductsLayout(layout: string) {
    this.productsLayout = layout;
  }
}
