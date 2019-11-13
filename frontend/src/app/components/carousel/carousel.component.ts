import { Component, OnInit, Input } from "@angular/core";
import { Product } from "@app/landing-page/store/landing-page.reducers";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"]
})
export class CarouselComponent implements OnInit {
  @Input() items: Product[];

  constructor() {}

  ngOnInit() {}
}
