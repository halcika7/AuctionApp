import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as LandingPageActions from '@app/landing-page/store/landing-page.actions';
import { Product } from '@app/landing-page/store/landing-page.reducers';

@Component({
  selector: 'app-product-tabs',
  templateUrl: './product-tabs.component.html',
  styleUrls: ['./product-tabs.component.scss']
})
export class ProductTabsComponent implements OnInit {
  private _products: Product[] = [];
  private _offset = 0;
  private _active = 'newArrivals';
  private _showButton = true;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(new LandingPageActions.LandingPageStart('newArrivals/8'));
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
        this.store.dispatch(new LandingPageActions.LandingPageStart('newArrivals/8'));
      } else if (this.active === 'topRated') {
        this.store.dispatch(new LandingPageActions.LandingPageStart('topRated/8'));
      } else {
        this.store.dispatch(new LandingPageActions.LandingPageStart('lastChance/8'));
      }
    }
  }

  loadMore(e: Event) {
    e.preventDefault();
    this.offset += 8;
    this.store.dispatch(new LandingPageActions.LoadMoreProductsStart(this.active, this.offset));
  }

  set products(products: Product[]) {
    this._products = products;
  }

  get products(): Product[] {
    return this._products;
  }

  set offset(val: number) {
    this._offset = val;
  }

  get offset(): number {
    return this._offset;
  }

  set active(str: string) {
    this._active = str;
  }

  get active(): string {
    return this._active;
  }

  set showButton(val: boolean) {
    this._showButton = val;
  }

  get showButton(): boolean {
    return this._showButton;
  }
}
