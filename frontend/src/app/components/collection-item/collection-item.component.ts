import { Component, OnInit, Input } from "@angular/core";
import { Product } from "@app/landing-page/store/landing-page.reducers";

@Component({
  selector: "app-collection-item",
  templateUrl: "./collection-item.component.html",
  styleUrls: ["./collection-item.component.scss"]
})
export class CollectionItemComponent implements OnInit {
  @Input() item: Product;

  constructor() {}

  ngOnInit() {}
}
