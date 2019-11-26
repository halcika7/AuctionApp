import { Component, OnInit, OnDestroy } from "@angular/core";
import { Options } from "ng5-slider";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { Categories } from "@app/containers/all-categories/store/all-categories.reducer";
import { CategoriesStart } from "@app/containers/all-categories/store/all-categories.actions";
import * as ShopPageActions from "./store/shop-page.actions";
import { ActivatedRoute, Params } from "@angular/router";
import { Brand, Prices, Filters } from "./store/shop-page.reducer";
import { Product } from "@app/landing-page/store/landing-page.reducers";

@Component({
  selector: "app-shop-page",
  templateUrl: "./shop-page.component.html",
  styleUrls: ["./shop-page.component.scss"]
})
export class ShopPageComponent implements OnInit, OnDestroy {
  productsLayout = "three-cols auto";
  prices: Prices = {};
  minValue: number;
  maxValue: number;
  options: Options = {
    floor: 0,
    ceil: 0,
    step: 0.1
  };
  categories: Categories[] = [];
  products: Product[] = [];
  brands: Brand[] = [];
  filters: Filters[] = [];
  categoryId: string;
  subcategoryId: string;
  subcategory: string;
  brandId: string;
  filterIds: String[] = [];
  filterProduct = {
    subcategoryId: null,
    min: null,
    max: null,
    brandId: null,
    filterValueIds: [],
    offSet: 0
  };

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ categoryId, subcategoryId }: Params) => {
      this.filterProduct = {
        subcategoryId: null,
        min: null,
        max: null,
        brandId: null,
        filterValueIds: [],
        offSet: 0
      };
      if (categoryId && subcategoryId) {
        this.categoryId = categoryId;
        this.subcategoryId = subcategoryId;
        this.filterProduct.subcategoryId = subcategoryId;
        this.checkActiveSubcategory();
      }

      this.dispatchActions(true);
    });
    this.store.dispatch(new CategoriesStart("/categories/true"));
    this.store.select("categoriesPage").subscribe(({ categories }) => {
      this.categories = categories;
      this.checkActiveSubcategory();
    });

    this.store
      .select("shopPage")
      .subscribe(({ brands, prices, filters, products }) => {
        this.products = products;
        if (this.showIfKeysLength(prices)) {
          this.prices = prices;
          this.minValue = prices.min_price;
          this.maxValue = prices.max_price;
          this.options = {
            floor: this.minValue,
            ceil: this.maxValue,
            step: 0.1
          };
          if (this.products.length === 0) {
            this.filterProduct = {
              ...this.filterProduct,
              min: null,
              max: null,
              brandId: null,
              filterValueIds: [],
              offSet: 0
            };
            // this.store.dispatch(
            //   new ShopPageActions.ShopStart(
            //     `/shop/products?filters=${JSON.stringify(this.filterProduct)}`
            //   )
            // );
          }
        }
        this.brands = brands;
        this.filters = filters;
      });
  }

  ngOnDestroy() {
    this.store.dispatch(new ShopPageActions.ClearShopPageState());
  }

  changeProductsLayout(layout: string) {
    this.productsLayout = layout;
  }

  private checkActiveSubcategory() {
    if (this.categoryId && this.subcategoryId && this.categories.length > 0) {
      this.subcategory = this.categories[
        parseInt(this.categoryId) - 1
      ].Subcategories.filter(
        subcategories =>
          this.subcategoryId === subcategories.id && subcategories.name
      )[0].name;
    } else {
      this.subcategory = "all categories";
    }
  }

  showIfKeysLength(value): boolean {
    return Object.keys(value).length > 0 ? true : false;
  }

  changeValues({ value, highValue }) {
    this.filterProduct.min = value;
    this.filterProduct.max = highValue;
    this.dispatchActions(true);
  }

  filterClicked(brand: boolean, id: string, filterValueId: string) {
    if (brand) {
      this.filterProduct.min = null;
      this.filterProduct.max = null;
      this.brandId = id;
      this.filterProduct.brandId = id;
      this.dispatchActions(true);
    } else {
      const findFilterId = this.filterIds.findIndex(filter => filter === id);
      if (findFilterId === -1) {
        this.filterIds.push(id);
        this.filterProduct.filterValueIds.push(filterValueId);
      } else {
        this.filterProduct.filterValueIds[findFilterId] = filterValueId;
      }
      this.dispatchActions();
    }
  }

  checkActivity(id): boolean {
    const findIndex = this.filterProduct.filterValueIds.findIndex(
      Id => Id === id
    );
    return findIndex !== -1 ? true : false;
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
        `/shop/products?filters=${JSON.stringify(this.filterProduct)}`
      )
    );
    this.store.dispatch(
      new ShopPageActions.ShopStart(
        `/shop/prices?filters=${JSON.stringify(this.filterProduct)}`
      )
    );
    this.store.dispatch(
      new ShopPageActions.ShopStart(
        `/shop/filters?filters=${JSON.stringify(this.filterProduct)}`
      )
    );
  }
}
