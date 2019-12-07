import { Subscription } from "rxjs";
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
  private _filterProduct = {
    subcategoryId: null,
    min: null,
    max: null,
    brandId: null,
    filterValueIds: [],
    offSet: 0,
    orderBy: null
  };
  private _filterIds: string[] = [];
  private subscription = new Subscription();

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(new CategoriesStart("/categories/true"));
    this.subscription.add(
      this.route.params.subscribe(
        ({ categoryId = null, subcategoryId = null }: Params) => {
          this.resetProductFilter({ resetSubcategory: true });
          this._categoryId = categoryId;
          this._subcategoryId = subcategoryId;
          this._filterProduct.subcategoryId = subcategoryId;
          this.checkActiveSubcategory();
          this.dispatchActions(true, true);
        }
      )
    );
    this.subscription.add(
      this.store.select("categoriesPage").subscribe(({ categories }) => {
        this._categories = categories;
        this.checkActiveSubcategory();
      })
    );
    this.subscription.add(
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
          }
        )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShopPageActions.ClearShopPageState());
  }

  showIfKeysLength(value): boolean {
    return Object.keys(value).length > 0 ? true : false;
  }

  changePriceValues({ value, highValue }) {
    if (this.prices.min_price != value || this.prices.max_price != highValue) {
      this._filterProduct.min = value;
      this._filterProduct.max = highValue;
    } else {
      this._filterProduct.min = null;
      this._filterProduct.max = null;
    }
    this.resetProductFilter({ onlyOffset: true });
    this.dispatchActions(true, true);
  }

  filterClicked({ brand, id, filterValueId }) {
    if (brand) {
      this._filterProduct.brandId =
        this._filterProduct.brandId === id ? null : id;
      this._filterIds = [];
      this.resetProductFilter({ resetSubcategory: false, resetBrand: false });
      this.dispatchActions(true, true);
    } else {
      const findFilterId = this._filterIds.findIndex(filter => filter === id);
      if (findFilterId === -1) {
        this._filterIds.push(id);
        this._filterProduct.filterValueIds.push(filterValueId);
      } else {
        if (
          this._filterProduct.filterValueIds[findFilterId] === filterValueId
        ) {
          this._filterIds.splice(findFilterId, 1);
          this._filterProduct.filterValueIds.splice(findFilterId, 1);
        } else {
          this._filterProduct.filterValueIds[findFilterId] = filterValueId;
        }
      }
      this.resetProductFilter({ onlyOffset: true });
      this.dispatchActions(false, true);
    }
  }

  changeOrderBy(val: string | null) {
    this._filterProduct.orderBy = val;
    this._filterProduct.offSet = 0;
    this.dispatchActions(false, true);
  }

  loadMoreProducts() {
    this._filterProduct.offSet += 9;
    this.dispatchAction("/shop/products", true);
  }

  resetFilterClick() {
    this.resetProductFilter({});
    this.dispatchActions(true, true);
  }

  checkShowClearFilters(): boolean {
    return this._filterProduct.max !== null ||
      this._filterProduct.min !== null ||
      this._filterProduct.brandId !== null ||
      this._filterProduct.filterValueIds.length > 0
      ? true
      : false;
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

  private dispatchActions(refreshBrands = false, refreshProducts = false) {
    refreshBrands && this.dispatchAction("/shop/brands");
    this._filterProduct.subcategoryId && this.dispatchAction("/shop/filters");
    refreshProducts && this.dispatchAction("/shop/products");
    this.dispatchAction("/shop/prices");
  }

  private dispatchAction(url: string, loadMore: boolean = false) {
    const queryObj = `${url}?filters=${JSON.stringify(this._filterProduct)}`;
    !loadMore && this.store.dispatch(new ShopPageActions.ShopStart(queryObj));
    loadMore &&
      this.store.dispatch(new ShopPageActions.ShopPageLoadMoreStart(queryObj));
  }

  private resetProductFilter({
    resetSubcategory = false,
    onlyOffset = false,
    resetBrand = true
  }) {
    if (!onlyOffset) {
      this._filterProduct = {
        subcategoryId: resetSubcategory
          ? null
          : this._filterProduct.subcategoryId,
        min: null,
        max: null,
        brandId: resetBrand ? null : this._filterProduct.brandId,
        filterValueIds: [],
        offSet: 0,
        orderBy: null
      };
      this._filterIds = [];
    } else {
      this._filterProduct.offSet = 0;
    }
  }

  get filterProduct() {
    return this._filterProduct;
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
}
