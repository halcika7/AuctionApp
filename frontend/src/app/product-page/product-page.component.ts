import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromApp from '@app/store/app.reducer';
import * as ProductPageActions from './store/product-page.actions';
import { FullProduct, Bid } from './store/product-page.reducer';
import { Product } from '@app/landing-page/store/landing-page.reducers';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit, OnDestroy {
  private _product: FullProduct;
  private _bids: Bid[] = [];
  private _similarProducts: Product[] = [];
  private _minPrice: any;
  private _hide = false;
  private _disabled = false;
  private _userId: string;
  private _message = ''; // if user is owner or not loggedin
  private _noBids = true;
  private _validation = '';
  private _enteredPrice = null;
  private subscription = new Subscription();
  successMessage = '';
  failedMessage = '';

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.route.params.subscribe(({ id, subcategoryId }: Params) => {
        if (!id || !subcategoryId) {
          this.router.navigate(['/404']);
        }
        this.store.dispatch(new ProductPageActions.ProductStart(id));
        this.store.dispatch(new ProductPageActions.SimilarProductStart(id, subcategoryId));
      })
    );

    this.subscription.add(
      this.store
        .select('productPage')
        .subscribe(({ product, similarProducts, bids, error, failedMessage, successMessage }) => {
          if (error) {
            this.router.navigate(['/404']);
          }
          if (successMessage) {
            this._enteredPrice = null;
          }
          this._product = product;
          this._bids = bids;
          this._similarProducts = similarProducts;
          this._minPrice =
            product.highest_bid >= product.price ? product.highest_bid : product.price;
          this._hide = new Date(product.auctionStart) > new Date() ? true : false;
          this._noBids = product.highest_bid === 0 ? true : false;
          this.failedMessage = failedMessage;
          this.successMessage = successMessage;
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
    this.store.dispatch(new ProductPageActions.ClearProductState());
    this.subscription.unsubscribe();
    this._enteredPrice = null;
  }

  private setMessageDisabled() {
    if (this.product.id) {
      this._disabled =
        this.product.userId === this.userId ||
        !this.userId ||
        (this.product.highest_bid === 0 && this._enteredPrice < this.minPrice) ||
        (this.product.highest_bid !== 0 && this._enteredPrice <= this.minPrice)
          ? true
          : false;
      this._message = this.hide
        ? ''
        : this.product.userId === this.userId && this.userId !== ''
        ? 'You can\'t place bid on your own product'
        : !this.userId
        ? 'Please login in order to place bid!'
        : '';
      this._validation = this.disabled ? 'Please enter higher value' : '';
    }
  }

  valueChange(e) {
    this._enteredPrice = e.target.value;
    this.setMessageDisabled();
  }

  onSubmit(input: HTMLInputElement) {
    this.setMessageDisabled();
    if (!this.disabled) {
      this.store.dispatch(
        new ProductPageActions.ProductBidStart(this.product.id, parseFloat(input.value))
      );
    }
    this._enteredPrice = null;
  }

  clearMessages() {
    this.store.dispatch(new ProductPageActions.ClearProductMessages());
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

  get bids(): Bid[] {
    return this._bids;
  }

  get validation(): string {
    return this._validation;
  }

  get enteredPrice(): number {
    return this._enteredPrice;
  }
}
