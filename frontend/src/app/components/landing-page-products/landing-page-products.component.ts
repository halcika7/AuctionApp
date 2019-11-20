import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-landing-page-products",
  templateUrl: "./landing-page-products.component.html",
  styleUrls: ["./landing-page-products.component.scss"]
})
export class LandingPageProductsComponent implements OnInit {
  @Input() title: string = '';
  @Input() className: string;
  @Input() padding: string;
  @Input() containerClass: boolean = true;
  @Input() items: [];

  constructor() {}

  ngOnInit() {}
}
