import { Component, OnInit, Input } from "@angular/core";
import { Categories } from "@app/containers/all-categories/store/all-categories.reducer";

@Component({
  selector: "app-categories-list",
  templateUrl: "./categories-list.component.html",
  styleUrls: ["./categories-list.component.scss"]
})
export class CategoriesListComponent implements OnInit {
  @Input() categories: Categories[];
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
