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
  featured: Product[] = [];
  featuredCollections: Product[] = [];
  categories: Categories[] = [];
  heroProduct: Product;

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
}
