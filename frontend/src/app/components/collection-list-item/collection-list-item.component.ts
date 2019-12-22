import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "@app/landing-page/store/landing-page.reducers";
import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as WishlistActions from "@app/wishlist/store/wishlist.actions";

@Component({
  selector: "app-collection-list-item",
  templateUrl: "./collection-list-item.component.html",
  styleUrls: ["./collection-list-item.component.scss"]
})
export class CollectionListItemComponent implements OnInit, OnDestroy {
  @Input() item: Product;
  private _wishlisted: boolean = false;
  private _userId: string;
  private subscription = new Subscription();

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription.add(
      this.store
        .select("wishlist")
        .pipe(
          map(({ wishlistIds }) => {
            return wishlistIds.filter(value => value === this.item.id);
          })
        )
        .subscribe(data => {
          this._wishlisted = data[0] === this.item.id;
        })
    );
    this.subscription.add(
      this.store.select("auth").subscribe(({ userId }) => {
        this._userId = userId;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addRemoveFromWishlist(e: any) {
    if (this._wishlisted) {
      this.store.dispatch(
        new WishlistActions.DeleteFromWishlistStart(this.item.id)
      );
    } else {
      this.store.dispatch(new WishlistActions.AddToWishlistStart(this.item.id));
    }
    e.target.blur();
  }

  get wishlisted(): boolean {
    return this._wishlisted;
  }

  get userId(): string {
    return this._userId;
  }
}
