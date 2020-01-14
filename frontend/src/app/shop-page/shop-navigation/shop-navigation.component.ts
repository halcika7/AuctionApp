import { Product } from "@app/landing-page/store/landing-page.reducers";
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { environment } from '../../../environments/environment';

@Component({
  selector: "app-shop-navigation",
  templateUrl: "./shop-navigation.component.html",
  styleUrls: ["./shop-navigation.component.scss"]
})
export class ShopNavigationComponent implements OnInit, OnChanges {
  private _productsLayout = "three-cols auto";
  @Input() products: Product[] = [];
  @Input() noMore: boolean;
  @Input() orderby: string;
  @Output() loadMore = new EventEmitter<any>();
  @Output() changeOrderBy = new EventEmitter<any>();
  private _orderBy = [
    environment.DEFAULT_SORTING,
    "Sort by Price Descending",
    "Sort by Price Ascending",
    "Sort by Time Left Descending",
    "Sort by Time Left Ascending"
  ];
  private _orderByText = environment.DEFAULT_SORTING;

  constructor() {}

  ngOnInit() {
    this._orderByText = this.orderby == null ? environment.DEFAULT_SORTING : this.orderby;
  }

  ngOnChanges() {
    this._orderByText = this.orderby == null ? environment.DEFAULT_SORTING : this.orderby;
  }

  changeProductsLayout(layout: string) {
    this._productsLayout = layout;
  }

  loadMoreProducts() {
    this.loadMore.emit();
  }

  changeOrderByChanged(value: number) {
    this._orderByText = this.orderBy[value];
    this.changeOrderBy.emit(
      this.orderBy[value] === environment.DEFAULT_SORTING ? null : this.orderBy[value]
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
