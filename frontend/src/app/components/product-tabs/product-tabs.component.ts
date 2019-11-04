import { LoadMoreProductsStart } from './../../landing-page/store/landing-page.actions';
import { Component, OnInit, Input } from '@angular/core';
import { Product } from './../../landing-page/store/landing-page.reducers';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as LandingPageActions from '../../landing-page/store/landing-page.actions';

@Component({
  selector: 'app-product-tabs',
  templateUrl: './product-tabs.component.html',
  styleUrls: ['./product-tabs.component.css']
})
export class ProductTabsComponent implements OnInit {
  products: Product[] = [];
  private offset = 0;
  active = 'newArrivals';
  showButton = true;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(new LandingPageActions.NewArrivalsProductStart());
    this.store.select('landingPage').subscribe(({ newArrivals, topRated, lastChance, noMore }) => {
      if (this.active === 'newArrivals') {
        this.products = newArrivals;
      } else if (this.active === 'topRated') {
        this.products = topRated;
      } else {
        this.products = lastChance;
      }
      if (this.products.length < 8 || noMore) {
        this.showButton = false;
      } else {
        this.showButton = true;
      }
    });
  }

  tabsChange(e: Event, tab: string) {
    e.preventDefault();
    if (tab !== this.active) {
      this.offset = 0;
      this.active = tab;
      if (this.active === 'newArrivals') {
        this.store.dispatch(new LandingPageActions.NewArrivalsProductStart());
      } else if (this.active === 'topRated') {
        this.store.dispatch(new LandingPageActions.TopRatedProductStart());
      } else {
        this.store.dispatch(new LandingPageActions.LastChanceProductStart());
      }
    }
  }

  loadMore(e: Event) {
    e.preventDefault();
    this.offset += 8;
    this.store.dispatch(new LandingPageActions.LoadMoreProductsStart(this.active, this.offset));
  }
}
