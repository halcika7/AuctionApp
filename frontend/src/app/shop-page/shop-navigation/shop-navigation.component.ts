import { Product } from "@app/landing-page/store/landing-page.reducers";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-shop-navigation",
  templateUrl: "./shop-navigation.component.html",
  styleUrls: ["./shop-navigation.component.scss"]
})
export class ShopNavigationComponent implements OnInit {
  private _productsLayout = "three-cols auto";
  @Input() products: Product[] = [];
  @Input() noMore: boolean;
  @Output() loadMore = new EventEmitter<any>();
  @Output() changeOrderBy = new EventEmitter<any>();
  private _orderBy = [
    "Default Sorting",
    "Sort by Price Descending",
    "Sort by Price Ascending",
    "Sort by Time Left Descending",
    "Sort by Time Left Ascending"
  ];
  private _orderByText = "Default Sorting";

  constructor() {}

  ngOnInit() {}

  changeProductsLayout(layout: string) {
    this._productsLayout = layout;
  }

  loadMoreProducts() {
    this.loadMore.emit();
  }

  changeOrderByChanged(value: number) {
    this._orderByText = this.orderBy[value];
    this.changeOrderBy.emit(
      this.orderBy[value] === "Default Sorting" ? null : this.orderBy[value]
    );
  }

  get productsLayout(): string {
    return this._productsLayout;
  }

  get orderByText(): string {
    return this._orderByText;
  }

  get orderBy(): string[] {
    return this._orderBy;
  }
}
