import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as ProfileActions from "../store/profile.actions";
import { ProfileService } from "./../profile.service";
import { ProfileProduct } from "../store/profile.reducer";

@Component({
  selector: "app-seller",
  templateUrl: "./seller.component.html",
  styleUrls: ["./seller.component.scss"]
})
export class SellerComponent implements OnInit, OnDestroy {
  private _activeNav: string = "active";
  private _products: ProfileProduct[] = [];
  private _offset: number = 0;
  private _noMore: boolean = false;

  constructor(
    private profileService: ProfileService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.profileService.changeBreadcrumb("seller");
    this.getProducts();
    this.store.select("profile").subscribe(({ products, noMore }) => {
      this._products = products;
      this._noMore = noMore;
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new ProfileActions.ClearProfile());
  }

  onChangeNav(val: string) {
    if (val !== this._activeNav) {
      this._activeNav = val;
      this._offset = 0;
      this.getProducts();
    }
  }

  loadMore(e: any) {
    this._offset += 8;
    this.getProducts(true);
    e.target.blur();
  }

  getProducts(loadMore = false) {
    const query = `/profile/products?data=${JSON.stringify({
      offset: this._offset,
      active: this._activeNav == "active" ? true : false
    })}`;
    this.store.dispatch(
      !loadMore
        ? new ProfileActions.ProfileStart(query)
        : new ProfileActions.LoadMoreStart(query)
    );
  }

  get activeNav(): string {
    return this._activeNav;
  }

  get products(): ProfileProduct[] {
    return this._products;
  }

  get noMore(): boolean {
    return this._noMore;
  }
}
