import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "@app/landing-page/store/landing-page.reducers";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { Wishlist } from "@app/wishlist/wishlist";

@Component({
  selector: "app-collection-item",
  templateUrl: "./collection-item.component.html",
  styleUrls: ["./collection-item.component.scss"]
})
export class CollectionItemComponent extends Wishlist
  implements OnInit, OnDestroy {
  @Input() item: Product;
  private _userId: string;
  private subscription = new Subscription();

  constructor(private store: Store<fromApp.AppState>) {
    super(store);
  }

  ngOnInit() {
    super.onInitWishlist(this.item.id);
    this.subscription.add(
      this.store.select("auth").subscribe(({ userId }) => {
        this._userId = userId;
      })
    );
  }

  ngOnDestroy() {
    super.onDestroy();
    this.subscription.unsubscribe();
  }

  get userId(): string {
    return this._userId;
  }
}
