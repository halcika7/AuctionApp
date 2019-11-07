import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as fromApp from '../store/app.reducer';
import * as ProductPageActions from './store/product-page.actions';
import * as AuthActions from '../auth/store/auth.actions';
import { FullProduct } from './store/product-page.reducer';
import { Product } from './../landing-page/store/landing-page.reducers';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  product: FullProduct;
  similarProducts: Product[] = [];
  minPrice: any;
  hide = false;
  disabled = false;
  userId: string;
  message = ''; // if user is owner or not loggedin

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ id }: Params) => {
      if (!id || !parseInt(id, 10)) {
        this.location.back();
      }
      this.store.dispatch(new ProductPageActions.ProductStart(id));
    });

    this.store.select('productPage').subscribe(({ product, similarProducts, error }) => {
      if (error) {
        this.location.back();
      }
      this.product = product;
      this.minPrice = product.highest_bid > product.price ? product.highest_bid : product.price;
      this.hide = new Date(product.auctionStart) > new Date() ? true : false;
      this.similarProducts = similarProducts;
      this.setMessageDisabled();
    });
    this.store.select('auth').subscribe(({ userId }) => {
      this.userId = userId;
      this.setMessageDisabled();
    });
  }

  setMessageDisabled() {
    if (this.product.id) {
      this.disabled = this.product.userId === this.userId || !this.userId ? true : false;
      this.message = this.hide
        ? ''
        : this.product.userId === this.userId && this.userId !== ''
        ? 'You can\'t place bid on your own product'
        : !this.userId
        ? 'Please login in order to place bid!'
        : '';
    }
  }
}
