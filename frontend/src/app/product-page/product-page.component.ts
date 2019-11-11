import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromApp from '@app/store/app.reducer';
import * as ProductPageActions from './store/product-page.actions';
import { FullProduct } from './store/product-page.reducer';
import { Product } from '@app/landing-page/store/landing-page.reducers';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit, OnDestroy {
  private _product: FullProduct;
  private _similarProducts: Product[] = [];
  private _minPrice: any;
  private _hide = false;
  private _disabled = false;
  private _userId: string;
  private _message = ''; // if user is owner or not loggedin
  private _noBids = true;
  private subscription = new Subscription();

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.route.params.subscribe(({ id }: Params) => {
        if (!id || !parseInt(id, 10)) {
          this.router.navigate(['/404']);
        }
        this.store.dispatch(new ProductPageActions.ProductStart(id));
      })
    );

    this.subscription.add(
      this.store.select('productPage').subscribe(({ product, similarProducts, error }) => {
        if (error) {
          this.router.navigate(['/404']);
        }
        this._product = product;
        this._minPrice = product.highest_bid > product.price ? product.highest_bid : product.price;
        this._hide = new Date(product.auctionStart) > new Date() ? true : false;
        this._noBids = product.highest_bid === 0 ? true : false;
        this._similarProducts = similarProducts;
        this.setMessageDisabled();
      })
    );

    this.subscription.add(
      this.store.select('auth').subscribe(({ userId }) => {
        this._userId = userId;
        this.setMessageDisabled();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setMessageDisabled() {
    if (this.product.id) {
      this._disabled = this.product.userId === this.userId || !this.userId ? true : false;
      this._message = this.hide
        ? ''
        : this.product.userId === this.userId && this.userId !== ''
        ? 'You can\'t place bid on your own product'
        : !this.userId
        ? 'Please login in order to place bid!'
        : '';
    }
  }

  get product(): FullProduct {
    return this._product;
  }

  get similarProducts(): Product[] {
    return this._similarProducts;
  }

  get minPrice(): any {
    return this._minPrice;
  }

  get hide(): boolean {
    return this._hide;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get userId(): string {
    return this._userId;
  }

  get message(): string {
    return this._message;
  }

  get noBids(): boolean {
    return this._noBids;
  }
}
