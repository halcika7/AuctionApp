import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Categories } from "@app/containers/all-categories/store/all-categories.reducer";

@Component({
  selector: "app-categories-list",
  templateUrl: "./categories-list.component.html",
  styleUrls: ["./categories-list.component.scss"]
})
export class CategoriesListComponent implements OnInit {
  @Input() categories: Categories[];
  @Input() shop: boolean = false;
  @Input() categoryId: string;
  @Input() subcategoryId: string;
  private _isOpen = false;

  constructor() {}

  ngOnInit() {}

  toggle() {
    this._isOpen = !this.isOpen;
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

}
