import { Component, OnInit, OnDestroy, ɵConsole } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Params, Router } from "@angular/router";
import * as fromApp from "@app/store/app.reducer";
import * as ProductPageActions from "./store/product-page.actions";
import { FullProduct, Bid } from "./store/product-page.reducer";
import { Product } from "@app/landing-page/store/landing-page.reducers";

@Component({
  selector: "app-product-page",
  templateUrl: "./product-page.component.html",
  styleUrls: ["./product-page.component.scss"]
})
export class ProductPageComponent implements OnInit, OnDestroy {
  private _product: FullProduct;
  private _bids: Bid[] = [];
  private _similarProducts: Product[] = [];
  private _minPrice: any;
  private _hide = false;
  private _userId: string;
  private _message: string;
  private _statusCode: number;
  private _noBids = true;
  private _enteredPrice = null;
  private _disabled = false;
  private subscription = new Subscription();

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.route.params.subscribe(({ id, subcategoryId }: Params) => {
        this._enteredPrice = null;
        if (!id || !subcategoryId) {
          this.router.navigate(["/404"]);
        }
        this.store.dispatch(new ProductPageActions.ProductStart(id));
        this.store.dispatch(
          new ProductPageActions.SimilarProductStart(id, subcategoryId)
        );
      })
    );

    this.subscription.add(
      this.store
        .select("productPage")
        .subscribe(
          ({ product, similarProducts, bids, error, message, code }) => {
            if (error) {
              this.router.navigate(["/404"]);
            }
            if (code === 200) {
              this._enteredPrice = null;
            }
            this._product = product;
            this._bids = bids;
            this._similarProducts = similarProducts;
            this._minPrice =
              product.highest_bid >= product.price
                ? product.highest_bid
                : product.price;
            this._hide =
              new Date(product.auctionStart) > new Date() ? true : false;
            this._noBids = product.highest_bid === 0 ? true : false;
            this._message = message;
            this._statusCode = code;
            this._disabled = this.statusCode === 500 ? true : false;
            this.setMessageDisabled();
          }
        )
    );

    this.subscription.add(
      this.store.select("auth").subscribe(({ userId }) => {
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
    if (this.product.id && !this.statusCode) {
      this._message = this.hide
        ? ""
        : this.product.userId === this.userId && this.userId !== ""
        ? "You can't place bid on your own product"
        : "";
    }
    this._disabled =
      this._message === "You can't place bid on your own product" ||
      this._message === "Please login in order to place bid!"
        ? true
        : false;
  }

  valueChange(e) {
    this._enteredPrice = parseFloat(e.target.value) || null;
  }

  onSubmit(input: HTMLInputElement) {
    this.store.dispatch(
      new ProductPageActions.ProductBidStart(
        this.product.id,
        parseFloat(input.value)
      )
    );
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

  get hide(): boolean {
    return this._hide;
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

  get enteredPrice(): number {
    return this._enteredPrice;
  }

  get statusCode(): number {
    return this._statusCode;
  }

  get minPrice(): number {
    return this._minPrice;
  }

  get disabled(): boolean {
    return this._disabled;
  }
}
