import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as WishlistActions from "@app/wishlist/store/wishlist.actions";
import { Subscription } from "rxjs";

export class Wishlist {
  private _subscription = new Subscription();
  private _wishlisted: boolean = false;
  private _wishlistedIds: string[];
  private _productId: string;

  constructor(private _store: Store<fromApp.AppState>) {}

  onInitWishlist(productId: string, productPage: boolean = false) {
    this._productId = productId;
    this._subscription.add(
      this._store
        .select("wishlist")
        .pipe(
          map(({ wishlistIds }) =>
            productPage
              ? wishlistIds
              : wishlistIds.filter(value => value === productId)
          )
        )
        .subscribe(data => {
          if (productPage) {
            this._wishlistedIds = data;
            this.setWishlisted();
          } else {
            this._wishlisted = data[0] === productId;
          }
        })
    );
  }

  onDestroy() {
    this._subscription.unsubscribe();
  }

  addRemoveFromWishlist(e: any) {
    if (this._wishlisted) {
      this._store.dispatch(
        new WishlistActions.DeleteFromWishlistStart(this._productId)
      );
    } else {
      this._store.dispatch(
        new WishlistActions.AddToWishlistStart(this._productId)
      );
    }
    e.target.blur();
  }

  private setWishlisted() {
    if (this._productId) {
      this._wishlisted = this._wishlistedIds.filter(
        value => value === this._productId
      )[0]
        ? true
        : false;
    }
  }

  get wishlisted(): boolean {
    return this._wishlisted;
  }
}
