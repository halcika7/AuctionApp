import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Brand, Filters } from "./../store/shop-page.reducer";

@Component({
  selector: "app-shop-filters",
  templateUrl: "./shop-filters.component.html",
  styleUrls: ["./shop-filters.component.scss"]
})
export class ShopFiltersComponent implements OnInit {
  @Input() values: Brand[] | Filters[] = [];
  @Input() filterValueIds: string[];
  @Input() brandId: string;
  @Input() brand: boolean = true;
  @Output() resetFilter = new EventEmitter<any>();
  @Output() dispatchActions = new EventEmitter<any>();
  @Output() setBrandId = new EventEmitter<any>();
  private _filterIds: string[] = [];

  constructor() {}

  ngOnInit() {}

  filterClicked(brand: boolean, id: string, filterValueId: string) {
    if (brand) {
      this.resetFilter.emit({});
      this.brandId = id;
      this.setBrandId.emit(id);
      this.dispatchActions.emit(true);
    } else {
      const findFilterId = this._filterIds.findIndex(filter => filter === id);
      if (findFilterId === -1) {
        this._filterIds.push(id);
        this.filterValueIds.push(filterValueId);
      } else {
        this.filterValueIds[findFilterId] = filterValueId;
      }
      this.resetFilter.emit({ onlyOffset: true });
      this.dispatchActions.emit();
    }
  }

  checkActivity(id): boolean {
    return this.filterValueIds.findIndex(Id => Id === id) !== -1 ? true : false;
  }
}
