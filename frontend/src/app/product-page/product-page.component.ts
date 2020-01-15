import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Params, Router } from "@angular/router";
import * as fromApp from "@app/store/app.reducer";
import * as ProductPageActions from "./store/product-page.actions";
import { FullProduct, Bid, OwnerInfo } from "./store/product-page.reducer";
import { Product } from "@app/landing-page/store/landing-page.reducers";
import { Wishlist } from "@app/wishlist/wishlist";
import { WebSocketServiceService } from "@app/shared/services/web-socket-service.service";
import { WindowOnBeforeUnload } from "./../shared/windowOnBeforeUnload";
import { environment } from "../../environments/environment";

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
  private _ownerInfo: OwnerInfo;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private socketService: WebSocketServiceService
  ) {
    super(store);
    this.windowUnload = new WindowOnBeforeUnload(this.socketService);
  }

  ngOnInit() {
    this._emitedCount = false;

    this.subscription.add(
      this.store.select("auth").subscribe(({ userId }) => {
        if (this._userId && !userId) {
          this.store.dispatch(
            new ProductPageActions.ClearProductMessages(true)
          );
        }

        this._userId = userId;

        if (userId) this.addWatcher();

        this.setMessageDisabled();
      })
    );

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
            wonAuction,
            ownerInfo
          }) => {
            if (product.id) {
              this._highestBidUserId = highestBidUserId;

              if (numberOfViewers) {
                this._numberOfViewers = numberOfViewers.views;
              }

              super.onInitWishlist(product.id, true);
            }

            if (message === environment.PRODUCT_NOT_FOUND)
              this.router.navigate(["/404"]);

            if (success) {
              this._enteredPrice = null;
            }

            this._product = product;
            this.addWatcher();
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
            this._ownerInfo = ownerInfo;
            this.setMessageDisabled();
          }
        )
    );

    this.subscription.add(
      this.socketService
        .listen("watchers")
        .subscribe(
          (data: { views: number; productId: string; userIds: string[] }) => {
            this.socketWatcherHelper(data);
          }
        )
    );

    this.subscription.add(
      this.socketService
        .listen("afterLogoutWatchers")
        .subscribe(
          (data: { views: number; productId: string; userIds: string[] }[]) => {
            const productIdIndex = data.findIndex(
              values => values.productId === this._product.id
            );
            if (productIdIndex !== -1) {
              let newData = data[productIdIndex];
              this.socketWatcherHelper(newData);
            }
          }
        )
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
    this.windowUnload.beforeUnload(this._product.id, this.userId);
    if (this._userId) {
      this.socketService.emit("removeWatcher", {
        productId: this._product.id,
        userId: this._userId
      });
    }
    super.onDestroy();
    this.subscription.unsubscribe();
    this._enteredPrice = null;
  }

  private socketWatcherHelper(data: {
    views: number;
    productId: string;
    userIds: string[];
  }) {
    if (this._userId) {
      this.windowUnload.beforeUnload(this._product.id, this._userId);
      if (data.productId === this._product.id) {
        const findUserId = data.userIds.findIndex(id => id === this._userId);
        if (findUserId === -1) {
          this._emitedCount = false;
          this.addWatcher();
        }
        this.store.dispatch(new ProductPageActions.SetNumberOfViewers(data));
      }
    }
  }

  private setMessageDisabled() {
    if (
      this.product &&
      this.product.id &&
      !this._message &&
      this.product.userId === this.userId
    ) {
      this._message =
        this.hide || this.product.status == "closed"
          ? ""
          : environment.NO_BID_OWN_PRODUCT;
    }
    this._disabled =
      this._message === environment.NO_BID_OWN_PRODUCT ||
      this._message === environment.LOGIN_TO_BID
        ? true
        : false;
  }

  private addWatcher() {
    if (!this._emitedCount && this._product && this._product.id) {
      if (this._userId) {
        this.socketService.emit("watch", {
          views: this._numberOfViewers,
          productId: this._product.id,
          userId: this._userId
        });
      } else if (!this._userId) {
        this.socketService.emit("watch", {
          views: this._numberOfViewers,
          productId: this._product.id,
          userId: null
        });
      }
      this._emitedCount = true;
    }
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

  get ownerInfo(): OwnerInfo {
    return this._ownerInfo;
  }
}
