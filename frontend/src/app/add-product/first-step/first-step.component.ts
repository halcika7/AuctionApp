import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { Category } from "@app/containers/all-categories/store/all-categories.reducer";
import { Filters, Brand } from "@app/shop-page/store/shop-page.reducer";
import { AddProductService } from "./../add-product.service";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AddProductActions from "../store/add-product.actions";

@Component({
  selector: "app-first-step",
  templateUrl: "./first-step.component.html",
  styleUrls: ["./first-step.component.scss"]
})
export class FirstStepComponent implements OnInit, OnDestroy {
  @Output() emitChanges = new EventEmitter<any>();
  @Output() checkValidity = new EventEmitter<any>();
  @Input() form: FormGroup;
  @Input() brandData: Category = { id: null, name: null };
  @Input() categoryData: Category = { id: null, name: null };
  @Input() subcategoryData: Category = { id: null, name: null };
  @Input() filterData: {
    parentId: string;
    id: string;
    name: string;
  }[] = [];
  @Input() isValid: boolean;
  @Input() hasActiveProduct: boolean;
  @Input() currentStep: number;
  private _stepNumber: number = 1;
  private _categories: Category[] = [];
  private _subcategories: Category[] = [];
  private _brands: Brand[] = [];
  private _filters: Filters[] = [];
  private _categoryError: string;
  private _subcategoryError: string;
  private _brandError: string;
  private _filterErrors: string[] = [];
  private subscription = new Subscription();

  constructor(
    private store: Store<fromApp.AppState>,
    private addProductService: AddProductService
  ) {}

  ngOnInit() {
    this.checkValidity.emit();
    this.subscription.add(
      this.store
        .select("addProduct")
        .subscribe(({ categories, subcategories, brands, filters, errors }) => {
          this._categories = categories;
          this._subcategories = subcategories;
          this._brands = brands;
          this._filters = filters;
          this._categoryError = errors.category;
          this._subcategoryError = errors.subcategory;
          this._brandError = errors.brand;
          this._filterErrors = errors.filterErrors ? errors.filterErrors : [];
        })
    );
    this.subscription.add(this.form.valueChanges.subscribe(() => {
      this.checkValidity.emit();
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getselectedFilterValue(id: string): string | null {
    return this.filterData.find(filter => filter.parentId == id)
      ? this.filterData.find(filter => filter.parentId == id).name
      : null;
  }

  changeCategory({ id, value }: { id: string; value: string }) {
    if (this.categoryData.id !== id) {
      this.resetData({ categoryReset: true });
      this.categoryData = { id, name: value };
      this.emitData(this.categoryData, { category: true });
      this.dispatchAction(`/add-product/subcategories/${id}`);
      this.checkValidity.emit();
    }
  }

  changeSubcategory({ id, value }: { id: string; value: string }) {
    if (this.subcategoryData.id !== id) {
      this.resetData({});
      this.subcategoryData = { id, name: value };
      this.emitData(this.subcategoryData, { subcategory: true });
      this.dispatchAction(`/add-product/brands/${id}`);
      this.dispatchAction(`/add-product/filters/${id}`);
      this.checkValidity.emit();
    }
  }

  changeBrand({ id, value }: { id: string; value: string }) {
    if (this.brandData.id !== id) {
      this.brandData = { id, name: value };
      this.emitData(this.brandData, { brand: true });
      this.checkValidity.emit();
    }
  }

  changeFilter({
    id,
    value,
    parentId
  }: {
    id: string;
    value: string;
    parentId: string;
  }) {
    const findFilterIndex = this.filterData.findIndex(
      filter => filter.parentId == parentId
    );
    if (findFilterIndex == -1) {
      this.filterData.push({ parentId, id, name: value });
    } else {
      this.filterData[findFilterIndex] = { parentId, id, name: value };
    }
    this.emitData(this.filterData, { filter: true });
    this.checkValidity.emit();
  }

  buttonClicked(prev = true) {
    const value = prev ? this._stepNumber - 1 : this._stepNumber + 1;
    this.addProductService.changeStepValue(value);
    window.scrollTo(0, 0);
  }

  private emitData(data, rest) {
    this.emitChanges.emit({ data, ...rest });
  }

  private resetData({ categoryReset = false }) {
    this.store.dispatch(new AddProductActions.ClearBrands());
    this.store.dispatch(new AddProductActions.ClearFilters());
    if (categoryReset) {
      this.store.dispatch(new AddProductActions.ClearSubcategories());
      this.subcategoryData = { id: null, name: null };
      this.emitData(this.subcategoryData, { subcategory: true });
    }
    this.brandData = { id: null, name: null };
    this.filterData = [];
    this.emitData(this.brandData, { brand: true });
    this.emitData(this.filterData, { filter: true });
  }

  private dispatchAction(url: string) {
    this.store.dispatch(new AddProductActions.AddProductStart(url));
  }

  get categories(): Category[] {
    return this._categories;
  }

  get subcategories(): Category[] {
    return this._subcategories;
  }

  get brands(): Brand[] {
    return this._brands;
  }

  get filters(): Filters[] {
    return this._filters;
  }

  get stepNumber(): number {
    return this._stepNumber;
  }

  get categoryError(): string {
    return this._categoryError;
  }

  get subcategoryError(): string {
    return this._subcategoryError;
  }

  get brandError(): string {
    return this._brandError;
  }

  get filterErrors(): string[] {
    return this._filterErrors;
  }
}
