import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as LandingPageActions from './store/landing-page.actions';
import { CategoriesStart } from '../containers/all-categories/store/all-categories.actions';
import { Product } from './store/landing-page.reducers';
import { Categories } from './../containers/all-categories/store/all-categories.reducer';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  featured: Product[] = [];
  featuredCollections: Product[] = [];
  lastChance: Product[] = [];
  newArrivals: Product[] = [];
  topRated: Product[] = [];
  categories: Categories[] = [];
  heroProduct: Product;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select('landingPage').subscribe(state => {
      this.featured = state.featured;
      this.featuredCollections = state.featuredCollections;
      this.lastChance = state.lastChance;
      this.newArrivals = state.newArrivals;
      this.topRated = state.topRated;
      this.heroProduct = state.heroProduct;
    });
    this.store.select('categoriesPage').subscribe(({ categories }) => {
      this.categories = categories;
    });
    this.store.dispatch(new LandingPageActions.FeaturedProductStart());
    this.store.dispatch(new LandingPageActions.FeaturedCollectionStart());
    this.store.dispatch(new LandingPageActions.NewArrivalsProductStart());
    this.store.dispatch(new LandingPageActions.TopRatedProductStart());
    this.store.dispatch(new LandingPageActions.LastChanceProductStart());
    this.store.dispatch(new LandingPageActions.HeroProductStart());
    this.store.dispatch(new CategoriesStart());
  }
}
