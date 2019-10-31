import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as LandingPageActions from './store/landing-page.actions';
import { Product, Category } from './store/landing-page.reducers';

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
  categories: Category[] = [];
  heroProduct: Product;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select('landingPage').subscribe(state => {
      console.log('TCL: LandingPageComponent -> ngOnInit -> state', state);
      this.featured = state.featured;
      this.featuredCollections = state.featuredCollections;
      this.lastChance = state.lastChance;
      this.newArrivals = state.newArrivals;
      this.topRated = state.topRated;
      this.heroProduct = state.heroProduct;
      this.categories = state.categories;
    });
    this.store.dispatch(new LandingPageActions.FeaturedProductStart());
    this.store.dispatch(new LandingPageActions.FeaturedCollectionStart());
    this.store.dispatch(new LandingPageActions.NewArrivalsProductStart());
    this.store.dispatch(new LandingPageActions.TopRatedProductStart());
    this.store.dispatch(new LandingPageActions.LastChanceProductStart());
    this.store.dispatch(new LandingPageActions.HeroProductStart());
    this.store.dispatch(new LandingPageActions.CategoriesStart());
  }
}
