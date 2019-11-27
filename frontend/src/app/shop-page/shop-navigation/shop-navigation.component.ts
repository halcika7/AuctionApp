import { Product } from "@app/landing-page/store/landing-page.reducers";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-shop-navigation",
  templateUrl: "./shop-navigation.component.html",
  styleUrls: ["./shop-navigation.component.scss"]
})
export class ShopNavigationComponent implements OnInit {
  productsLayout = "three-cols auto";
  @Input() products: Product[] = [];

  constructor() {}

  ngOnInit() {}

  changeProductsLayout(layout: string) {
    this.productsLayout = layout;
  }
}
