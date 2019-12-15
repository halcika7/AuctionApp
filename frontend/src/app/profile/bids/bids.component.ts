import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as ProfileActions from "../store/profile.actions";
import { ProfileService } from "./../profile.service";
import { ProfileBid } from "../store/profile.reducer";

@Component({
  selector: "app-bids",
  templateUrl: "./bids.component.html",
  styleUrls: ["./bids.component.scss"]
})
export class BidsComponent implements OnInit, OnDestroy {
  private _bids: ProfileBid[] = [];
  private _noMore: boolean = false;
  private _offset: number = 0;
  private subscription = new Subscription();

  constructor(
    private profileService: ProfileService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.profileService.changeBreadcrumb("bids");
    this.getBids();
    this.subscription.add(
      this.store.select("profile").subscribe(({ bids, noMore }) => {
        this._bids = bids;
        this._noMore = noMore;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ProfileActions.ClearProfile());
  }

  getBids(loadMore = false) {
    let query = `/profile/bids?data=${JSON.stringify({
      offset: this._offset
    })}`;
    this.store.dispatch(
      !loadMore
        ? new ProfileActions.ProfileStart(query)
        : new ProfileActions.LoadMoreStart(query)
    );
  }

  loadMore(e: any) {
    this._offset += 8;
    this.getBids(true);
    e.target.blur();
  }

  get bids(): ProfileBid[] {
    return this._bids;
  }

  get noMore(): boolean {
    return this._noMore;
  }
}
