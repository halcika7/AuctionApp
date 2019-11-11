import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as LandingPageActions from './store/landing-page.actions';
import { Product } from '@app/landing-page/store/landing-page.reducers';
import { Categories } from '@app/containers/all-categories/store/all-categories.reducer';
import { CategoriesStart } from '@app/containers/all-categories/store/all-categories.actions';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private _featured: Product[] = [];
  private _featuredCollections: Product[] = [];
  private _categories: Categories[] = [];
  private _heroProduct: Product;
  private subscription = new Subscription();

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription.add(
      this.store.select('landingPage').subscribe(state => {
        this._featured = state.featured;
        this._featuredCollections = state.featuredCollections;
        this._heroProduct = state.heroProduct;
      })
    );
    this.subscription.add(
      this.store.select('categoriesPage').subscribe(({ categories }) => {
        this._categories = categories;
      })
    );
    this.store.dispatch(new LandingPageActions.LandingPageStart('featured/4'));
    this.store.dispatch(new LandingPageActions.LandingPageStart('featuredCollections/3'));
    this.store.dispatch(new LandingPageActions.LandingPageStart('heroProduct/1'));
    this.store.dispatch(new CategoriesStart());
  }

  ngOnDestroy() {
    this.store.dispatch(new LandingPageActions.ClearLandingState());
    this.subscription.unsubscribe();
  }

  get featured(): Product[] {
    return this._featured;
  }

  get featuredCollections(): Product[] {
    return this._featuredCollections;
  }

  get categories(): Categories[] {
    return this._categories;
  }

  get heroProduct(): Product {
    return this._heroProduct;
  }
}
