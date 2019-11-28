import { map } from "rxjs/operators";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { Categories } from "@app/containers/all-categories/store/all-categories.reducer";
import { CategoriesStart } from "@app/containers/all-categories/store/all-categories.actions";
import * as ShopPageActions from "./store/shop-page.actions";
import { ActivatedRoute, Params } from "@angular/router";
import {
  Brand,
  Prices,
  Filters,
  MappedPriceRange
} from "./store/shop-page.reducer";
import { Product } from "@app/landing-page/store/landing-page.reducers";

@Component({
  selector: "app-shop-page",
  templateUrl: "./shop-page.component.html",
  styleUrls: ["./shop-page.component.scss"]
})
export class ShopPageComponent implements OnInit, OnDestroy {
  private _prices: Prices = {};
  private _categories: Categories[] = [];
  private _products: Product[] = [];
  private _brands: Brand[] = [];
  private _filters: Filters[] = [];
  private _noMore: boolean;
  private _priceRange: MappedPriceRange[];
  private _categoryId: string;
  private _subcategoryId: string;
  private _breadcrumbSubcategory: string;
  filterProduct = {
    subcategoryId: null,
    min: null,
    max: null,
    brandId: null,
    filterValueIds: [],
    offSet: 0,
    orderBy: null
  };
  private _touched: boolean = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(new CategoriesStart("/categories/true"));
    this.route.params.subscribe(({ categoryId, subcategoryId }: Params) => {
      this.resetProductFilter({ resetSubcategory: true });
      this._categoryId = categoryId;
      this._subcategoryId = subcategoryId;
      this.filterProduct.subcategoryId = subcategoryId;
      this.checkActiveSubcategory();
      this.dispatchActions(true);
    });
    this.store.select("categoriesPage").subscribe(({ categories }) => {
      this._categories = categories;
      this.checkActiveSubcategory();
    });
    this.store
      .select("shopPage")
      .pipe(
        map(data => {
          const priceRange = data.priceRange.map(ranges => ({
            name: ranges.price_range,
            value: parseInt(ranges.count)
          }));
          return { ...data, priceRange };
        })
      )
      .subscribe(
        ({ brands, prices, filters, products, noMore, priceRange }) => {
          this._products = products;
          this._brands = brands;
          this._filters = filters;
          this._prices = prices;
          this._noMore = noMore;
          this._priceRange = priceRange;
          if (this.products.length === 0) {
            this.resetProductFilter({});
          }
        }
      );
  }

  ngOnDestroy() {
    this.store.dispatch(new ShopPageActions.ClearShopPageState());
  }

  private checkActiveSubcategory() {
    if (this.categoryId && this.subcategoryId && this.categories.length > 0) {
      this._breadcrumbSubcategory = this.categories[
        parseInt(this.categoryId) - 1
      ].Subcategories.filter(
        subcategories =>
          this.subcategoryId === subcategories.id && subcategories.name
      )[0].name;
    } else {
      this._breadcrumbSubcategory = "all categories";
    }
  }

  showIfKeysLength(value): boolean {
    return Object.keys(value).length > 0 ? true : false;
  }

  changePriceValues({ value, highValue }) {
    this.filterProduct.min = value;
    this.filterProduct.max = highValue;
    this._touched = true;
    this.filterProduct.offSet = 0;
    this.dispatchActions(true);
  }

  setBrandId(val: string) {
    this.filterProduct.brandId = val;
    this.filterProduct.offSet = 0;
    this._touched = true;
  }

  changeOrderBy(val: string | null) {
    this.filterProduct.orderBy = val;
    this.filterProduct.offSet = 0;
    this.store.dispatch(
      new ShopPageActions.ShopStart(
        `/shop/products?filters=${JSON.stringify(this.filterProduct)}`
      )
    );
  }

  loadMoreProducts() {
    this.filterProduct.offSet += 9;
    this.store.dispatch(
      new ShopPageActions.ShopPageLoadMoreStart(
        `/shop/products?filters=${JSON.stringify(this.filterProduct)}`
      )
    );
  }

  resetFilterClick() {
    this.resetProductFilter({});
    this.dispatchActions(true);
    this._touched = false;
  }

  private dispatchActions(refreshBrands = false) {
    if (refreshBrands) {
      this.store.dispatch(
        new ShopPageActions.ShopStart(
          `/shop/brands?filters=${JSON.stringify(this.filterProduct)}`
        )
      );
    }
    this.store.dispatch(
      new ShopPageActions.ShopStart(
        `/shop/filters?filters=${JSON.stringify(this.filterProduct)}`
      )
    );
    this.store.dispatch(
      new ShopPageActions.ShopStart(
        `/shop/products?filters=${JSON.stringify(this.filterProduct)}`
      )
    );
    this.store.dispatch(
      new ShopPageActions.ShopStart(
        `/shop/prices?filters=${JSON.stringify(this.filterProduct)}`
      )
    );
  }

  private resetProductFilter({ resetSubcategory = false, onlyOffset = false }) {
    if (!onlyOffset) {
      this.filterProduct = {
        ...this.filterProduct,
        min: null,
        max: null,
        brandId: null,
        filterValueIds: [],
        offSet: 0
      };

      if (resetSubcategory) {
        this.filterProduct.subcategoryId = null;
      }
    } else {
      this.filterProduct.offSet = 0;
    }
  }

  get prices(): Prices {
    return this._prices;
  }

  get categories(): Categories[] {
    return this._categories;
  }

  get products(): Product[] {
    return this._products;
  }

  get brands(): Brand[] {
    return this._brands;
  }

  get filters(): Filters[] {
    return this._filters;
  }

  get noMore(): boolean {
    return this._noMore;
  }

  get priceRange(): MappedPriceRange[] {
    return this._priceRange;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get subcategoryId(): string {
    return this._subcategoryId;
  }

  get breadcrumbSubcategory(): string {
    return this._breadcrumbSubcategory;
  }

  get touched(): boolean {
    return this._touched;
  }
}
