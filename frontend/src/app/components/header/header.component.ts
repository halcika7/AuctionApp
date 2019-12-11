import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _isAuthenticated = null;
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  ngOnInit() {
    this.subscription = this.store
      .select("auth")
      .subscribe(({ accessToken, loading, remember }) => {
        if (!loading) {
          if (
            accessToken &&
            (localStorage.getItem("accessToken") || remember)
          ) {
            this._isAuthenticated = true;
            localStorage.setItem("accessToken", accessToken);
          } else if (
            accessToken &&
            (sessionStorage.getItem("accessToken") || !remember)
          ) {
            this._isAuthenticated = true;
            sessionStorage.setItem("accessToken", accessToken);
          } else {
            this._isAuthenticated = false;
          }
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    this.store.dispatch(new AuthActions.LogoutStart());
  }

  onSearch(e: Event, input: HTMLInputElement) {
    e.preventDefault();
    if (input.value != "") {
      this.router.navigate(["/shop"], { queryParams: { name: input.value } });
    }
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}
