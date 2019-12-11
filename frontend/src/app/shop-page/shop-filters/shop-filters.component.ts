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
  @Output() clickFilter = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  checkActivity(id): boolean {
    return this.filterValueIds.findIndex(Id => Id === id) !== -1 ? true : false;
  }

  filterClicked(brand, id, filterValueId) {
    if (brand) {
      this.clickFilter.emit({ brand, id });
    } else {
      this.clickFilter.emit({ id, filterValueId });
    }
  }
}
