import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Params, Router } from "@angular/router";
import * as fromApp from "@app/store/app.reducer";
import * as ProductPageActions from "./store/product-page.actions";
import { FullProduct, Bid } from "./store/product-page.reducer";
import { Product } from "@app/landing-page/store/landing-page.reducers";
import { Wishlist } from "@app/wishlist/wishlist";
import { WebSocketServiceService } from "@app/shared/services/web-socket-service.service";
import { WindowOnBeforeUnload } from "./../shared/windowOnBeforeUnload";

@Component({
  selector: "app-product-page",
  templateUrl: "./product-page.component.html",
  styleUrls: ["./product-page.component.scss"]
})
export class ProductPageComponent extends Wishlist
  implements OnInit, OnDestroy {
  private _product: FullProduct;
  private _bids: Bid[] = [];
  private _similarProducts: Product[] = [];
  private _minPrice: any;
  private _hide = false;
  private _userId: string;
  private _message: string;
  private _success: boolean;
  private _noBids = true;
  private _enteredPrice = null;
  private _disabled = false;
  private subscription = new Subscription();
  private _numberOfViewers = 0;
  private _emitedCount = false;
  private _subcategoryId;
  private _highestBidUserId: string;
  private _wonAuction: boolean;
  private windowUnload: WindowOnBeforeUnload;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private socketService: WebSocketServiceService
  ) {
    super(store);
    this.windowUnload = new WindowOnBeforeUnload(socketService);
  }

  ngOnInit() {
    this._emitedCount = false;

    this.subscription.add(
      this.route.params.subscribe(({ id, subcategoryId }: Params) => {
        this._enteredPrice = null;
        if (!id || !subcategoryId) {
          this.router.navigate(["/404"]);
        }
        this._subcategoryId = subcategoryId;
        this.store.dispatch(
          new ProductPageActions.ProductStart(id, subcategoryId)
        );
        this.store.dispatch(
          new ProductPageActions.GetProductBids(id, subcategoryId)
        );
        this.store.dispatch(
          new ProductPageActions.SimilarProductStart(id, subcategoryId)
        );
      })
    );

    this.subscription.add(
      this.store
        .select("productPage")
        .subscribe(
          ({
            product,
            similarProducts,
            bids,
            message,
            success,
            numberOfViewers,
            highestBidUserId,
            wonAuction
          }) => {
            if (product.id) {
              this._highestBidUserId = highestBidUserId;
              this.windowUnload.beforeUnload(product.id);

              if (numberOfViewers) {
                this._numberOfViewers = numberOfViewers.views;
              }

              if (!this._emitedCount) {
                this.socketService.emit("watch", {
                  views: this._numberOfViewers,
                  productId: product.id
                });
                this._emitedCount = true;
              }

              super.onInitWishlist(product.id, true);
            }

            if (message === "Product not found !")
              this.router.navigate(["/404"]);

            if (success) {
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
            this._success = success;
            this._disabled = !this._success;
            this._wonAuction = wonAuction;
            this.setMessageDisabled();
          }
        )
    );

    this.subscription.add(
      this.store.select("auth").subscribe(({ userId }) => {
        if (this._userId && !userId) {
          this.store.dispatch(
            new ProductPageActions.ClearProductMessages(true)
          );
        }
        this._userId = userId;
        this.setMessageDisabled();
      })
    );

    this.subscription.add(
      this.socketService
        .listen("watchers")
        .subscribe((data: { views: number; productId: string }) => {
          this.store.dispatch(new ProductPageActions.SetNumberOfViewers(data));
        })
    );

    this.subscription.add(
      this.socketService
        .listen("bid-added")
        .subscribe(({ productId, highest_bid, userId }) => {
          if (this._product.id === productId) {
            this.clearMessages();
            this.store.dispatch(
              new ProductPageActions.UpdateProductAfterBid(highest_bid, userId)
            );

            if (this._userId !== userId) {
              this.store.dispatch(
                new ProductPageActions.SetMessage(
                  `Someone added new bid ($${highest_bid})`
                )
              );
            }

            if (this._product.userId === this._userId) {
              this.store.dispatch(
                new ProductPageActions.GetProductBids(
                  productId,
                  this._subcategoryId
                )
              );
            }
          }
        })
    );

    this.subscription.add(
      this.socketService
        .listen("auction-ended")
        .subscribe(({ productId, userId }) => {
          if (this._product.id === productId && this._userId === userId) {
            this.clearMessages();
            this.store.dispatch(
              new ProductPageActions.UpdateProductAfterAuctionEnd(true)
            );
          } else if (this._product.id === productId) {
            this.clearMessages();
            this.store.dispatch(
              new ProductPageActions.UpdateProductAfterAuctionEnd()
            );
          }
        })
    );
  }

  ngOnDestroy() {
    this.socketService.emit("removeWatcher", this._product.id);
    super.onDestroy();
    this.subscription.unsubscribe();
    this._enteredPrice = null;
  }

  private setMessageDisabled() {
    if (
      this.product.id &&
      !this._message &&
      this.product.userId === this.userId
    ) {
      this._message = this.hide
        ? ""
        : "You can't place bid on your own product";
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

  get success(): boolean {
    return this._success;
  }

  get minPrice(): number {
    return this._minPrice;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get numberOfViewers(): number {
    return this._numberOfViewers;
  }

  get highestBidUserId(): string {
    return this._highestBidUserId;
  }

  get wonAuction(): boolean {
    return this._wonAuction;
  }
}
