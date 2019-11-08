import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as LandingPageActions from './store/landing-page.actions';
import { Product } from '@app/landing-page/store/landing-page.reducers';
import { Categories } from '@app/containers/all-categories/store/all-categories.reducer';
import { CategoriesStart } from '@app/containers/all-categories/store/all-categories.actions';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  private _featured: Product[] = [];
  private _featuredCollections: Product[] = [];
  private _categories: Categories[] = [];
  private _heroProduct: Product;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select('landingPage').subscribe(state => {
      this.featured = state.featured;
      this.featuredCollections = state.featuredCollections;
      this.heroProduct = state.heroProduct;
    });
    this.store.select('categoriesPage').subscribe(({ categories }) => {
      this.categories = categories;
    });
    this.store.dispatch(new LandingPageActions.LandingPageStart('featured/4'));
    this.store.dispatch(new LandingPageActions.LandingPageStart('featuredCollections/3'));
    this.store.dispatch(new LandingPageActions.LandingPageStart('heroProduct/1'));
    this.store.dispatch(new CategoriesStart());
  }

  set featured(products: Product[]) {
    this._featured = products;
  }

  get featured(): Product[] {
    return this._featured;
  }

  set featuredCollections(products: Product[]) {
    this._featuredCollections = products;
  }

  get featuredCollections(): Product[] {
    return this._featuredCollections;
  }

  set categories(categs: Categories[]) {
    this._categories = categs;
  }

  get categories(): Categories[] {
    return this._categories;
  }

  set heroProduct(prod: Product) {
    this._heroProduct = prod;
  }

  get heroProduct(): Product {
    return this._heroProduct;
  }
}
