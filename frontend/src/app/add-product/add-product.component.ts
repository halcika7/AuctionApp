import { partialFormValidity } from "@app/shared/partialFormValidity";
import { isEmptyObject } from "@app/shared/isEmptyObject";
import { Category } from "../containers/all-categories/store/all-categories.reducer";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../profile/profile.service";
import {
  NAME_VALIDATOR,
  numberOfWordsValidator,
  BASIC_INPUT
} from "../shared/validators";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AddProductActions from "./store/add-product.actions";
import { AddProductService } from "./add-product.service";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"]
})
export class AddProductComponent implements OnInit {
  private _form: FormGroup;
  private _numberOfActiveProducts: number;
  private _stepNumber: number;
  private numberOfFilters = 0;
  private _selectedCategoryData: Category = { id: null, name: null };
  private _selectedSubcategoryData: Category = { id: null, name: null };
  private _selectedBrandData: Category = { id: null, name: null };
  private _selectedFilterData: {
    parentId: string;
    id: string;
    name: string;
  }[] = [];
  private _isValid: boolean = false;

  constructor(
    private addProductService: AddProductService,
    private profileService: ProfileService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this._stepNumber = this.addProductService.stepNumber;
    this.profileService.changeBreadcrumb("become seller");
    this._form = new FormGroup({
      ...NAME_VALIDATOR("name", 5, 60, [numberOfWordsValidator()]),
      ...NAME_VALIDATOR("description", 0, 700, [
        numberOfWordsValidator(100, null)
      ]),
      ...NAME_VALIDATOR("images", 3, 20),
      ...NAME_VALIDATOR("price", 1, 20000),
      ...NAME_VALIDATOR("startDate"),
      ...NAME_VALIDATOR("endDate"),
      ...NAME_VALIDATOR("address"),
      ...NAME_VALIDATOR("country"),
      ...NAME_VALIDATOR("city"),
      ...NAME_VALIDATOR("zip"),
      ...NAME_VALIDATOR("phone"),
      ...BASIC_INPUT("freeShipping", false),
      ...BASIC_INPUT("featureProduct", false),
      ...BASIC_INPUT("useCard", false),
      ...BASIC_INPUT("useOptionalInfo", false),
      ...BASIC_INPUT("cName"),
      ...BASIC_INPUT("cNumber"),
      ...BASIC_INPUT("CVC")
    });

    this.store.dispatch(
      new AddProductActions.AddProductStart("/add-product/optionalinfo")
    );

    this.store.dispatch(
      new AddProductActions.AddProductStart("/add-product/categories")
    );

    this.store.dispatch(
      new AddProductActions.AddProductStart("/add-product/activeproducts")
    );

    this.store
      .select("addProduct")
      .subscribe(({ numberOfActiveProducts, filters }) => {
        this.numberOfFilters = filters.length;
        this._numberOfActiveProducts = numberOfActiveProducts;
        if (this._numberOfActiveProducts && this.stepNumber == 0) {
          this.addProductService.changeStepValue(1);
        }
      });

    this.addProductService.buttonClicked.subscribe(value => {
      this._stepNumber = value;
    });
  }

  firstStepValueChange({
    data,
    category = false,
    subcategory = false,
    brand = false,
    filter = false
  }) {
    if (category) {
      this._selectedCategoryData = data;
    }

    if (subcategory) {
      this._selectedSubcategoryData = data;
    }

    if (brand) {
      this._selectedBrandData = data;
    }

    if (filter) {
      this._selectedFilterData = data;
    }
  }

  firstStepCheckValidity() {
    const { name, description, images } = this.form.controls;
    this._isValid =
      !partialFormValidity([name, description, images]) ||
      isEmptyObject(this._selectedCategoryData) ||
      isEmptyObject(this._selectedBrandData) ||
      isEmptyObject(this._selectedSubcategoryData) ||
      this._selectedFilterData.length !== this.numberOfFilters
        ? false
        : true;
  }

  submitForm(data) {
    console.log('TCL: submitForm -> data', data)
    const formData = new FormData();
    const productData = {
      name: this.form.value.name,
      price: this.form.value.price,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      description: this.form.value.description,
      freeShipping: this.form.value.freeShipping,
      featured: this.form.value.featureProduct
    };
    const addressInformation = {
      address: this.form.value.address,
      city: this.form.value.city,
      country: this.form.value.country,
      phone: this.form.value.phone,
      zip: this.form.value.zip
    };
    const cardInformation = {
      useCard: this.form.value.useCard,
      cvc: this.form.value.CVC,
      name: this.form.value.cName,
      number: this.form.value.cNumber,
      exp_year: data.exp_year || null,
      exp_month: data.exp_month || null
    };
    formData.append("productData", JSON.stringify(productData));
    formData.append("addressInformation", JSON.stringify(addressInformation));
    formData.append("cardInformation", JSON.stringify(cardInformation));
    formData.append("categoryData", JSON.stringify(this._selectedCategoryData));
    formData.append(
      "subcategoryData",
      JSON.stringify(this._selectedSubcategoryData)
    );
    formData.append("brandData", JSON.stringify(this._selectedBrandData));
    formData.append("filtersData", JSON.stringify(this._selectedFilterData));
    if(this.form.value.images.length > 0) {
      this.form.value.images.forEach(
        async image => await formData.append("images", image)
      );
    }
    this.store.dispatch(new AddProductActions.AddUserProductStart(formData));
  }

  get numberOfActiveProducts(): number {
    return this._numberOfActiveProducts;
  }

  get form(): FormGroup {
    return this._form;
  }

  get stepNumber(): number {
    return this._stepNumber;
  }

  get brandData() {
    return this._selectedBrandData;
  }

  get categoryData() {
    return this._selectedCategoryData;
  }

  get subcategoryData() {
    return this._selectedSubcategoryData;
  }

  get filterData() {
    return this._selectedFilterData;
  }

  get isValid(): boolean {
    return this._isValid;
  }
}
