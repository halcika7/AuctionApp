import { Component, OnInit, Input } from '@angular/core';
import { Product } from './../../landing-page/store/landing-page.reducers';

@Component({
  selector: 'app-product-tabs',
  templateUrl: './product-tabs.component.html',
  styleUrls: ['./product-tabs.component.css']
})
export class ProductTabsComponent implements OnInit {
  @Input() lastChance: Product[];
  @Input() newArrivals: Product[];
  @Input() topRated: Product[];
  active = 'newArrivals';

  constructor() {}

  ngOnInit() {}

  tabsChange(e: Event, tab: string) {
    e.preventDefault();
    this.active = tab;
  }
}
