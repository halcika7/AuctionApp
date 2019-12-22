import { ProfileService } from "./../profile.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ProfileProduct } from "@app/profile/store/profile.reducer";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as ProfileActions from "../store/profile.actions";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.scss"]
})
export class WishlistComponent implements OnInit, OnDestroy {
  private _products: ProfileProduct[] = [];
  private _noMore: boolean;
  private _offset: number = 0;
  private subscription = new Subscription();

  constructor(
    private profileService: ProfileService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.getWishlistProducts();
    this.profileService.changeBreadcrumb("wishlist");
    this.subscription.add(
      this.store.select("profile").subscribe(({ products, noMore }) => {
        this._products = products;
        this._noMore = noMore;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadMore(e: any) {
    this._offset += 8;
    this.getWishlistProducts(true);
    e.target.blur();
  }

  getWishlistProducts(loadMore = false) {
    const query = `/profile/wishlist?data=${JSON.stringify({
      offset: this._offset
    })}`;
    this.store.dispatch(
      !loadMore
        ? new ProfileActions.ProfileStart(query)
        : new ProfileActions.LoadMoreStart(query)
    );
  }

  get products(): ProfileProduct[] {
    return this._products;
  }

  get noMore(): boolean {
    return this._noMore;
  }
}
