import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as LandingPageActions from '@app/landing-page/store/landing-page.actions';
import { Product } from '@app/landing-page/store/landing-page.reducers';

@Component({
  selector: 'app-product-tabs',
  templateUrl: './product-tabs.component.html',
  styleUrls: ['./product-tabs.component.scss']
})
export class ProductTabsComponent implements OnInit, OnDestroy {
  private _products: Product[] = [];
  private _offset = 0;
  private _active = 'newArrivals';
  private _showButton = true;
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(new LandingPageActions.LandingPageStart('newArrivals/8'));
    this.subscription = this.store
      .select('landingPage')
      .subscribe(({ newArrivals, topRated, lastChance, noMore }) => {
        if (this.active === 'newArrivals') {
          this._products = newArrivals;
        } else if (this.active === 'topRated') {
          this._products = topRated;
        } else {
          this._products = lastChance;
        }
        if (this.products.length < 8 || noMore) {
          this._showButton = false;
        } else {
          this._showButton = true;
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  tabsChange(e: Event, tab: string) {
    e.preventDefault();
    if (tab !== this.active) {
      this._offset = 0;
      this._active = tab;
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
    this._offset += 8;
    this.store.dispatch(new LandingPageActions.LoadMoreProductsStart(this.active, this.offset));
  }

  get products(): Product[] {
    return this._products;
  }

  get offset(): number {
    return this._offset;
  }

  get active(): string {
    return this._active;
  }

  get showButton(): boolean {
    return this._showButton;
  }
}
