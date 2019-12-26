import { Router, NavigationEnd } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { filter } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromApp from "./store/app.reducer";
import * as AuthActions from "./auth/store/auth.actions";
import { UserWishlistIdsStart } from "./wishlist/store/wishlist.actions";
import { WindowOnBeforeUnload } from './shared/windowOnBeforeUnload';
import { WebSocketServiceService } from './shared/services/web-socket-service.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  private _notFound = false;
  private windowUnload: WindowOnBeforeUnload;

  constructor(
    private location: Location,
    private router: Router,
    private store: Store<fromApp.AppState>,
    private socketService: WebSocketServiceService
  ) {
    this.windowUnload = new WindowOnBeforeUnload(socketService);
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.location.path() === "/404") {
          this._notFound = true;
        } else {
          this._notFound = false;
        }
      });
    if (
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken")
    ) {
      this.store.dispatch(new AuthActions.RefreshTokenStart());
      this.store.dispatch(new UserWishlistIdsStart());
    }

    this.windowUnload.beforeUnload();

  }

  get notFound(): boolean {
    return this._notFound;
  }
}
