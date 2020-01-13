import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { WebSocketServiceService } from '@app/shared/services/web-socket-service.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _isAuthenticated = null;
  private subscription = new Subscription();
  private _searchValue: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private socket: WebSocketServiceService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.store
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
        })
    );

    this.subscription.add(
      this.route.queryParams.subscribe(({ name }) => {
        this._searchValue = name || "";
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.store.dispatch(new AuthActions.LogoutStart());
  }

  onSearch(e: Event, input: HTMLInputElement) {
    const splitUrl = this.router.url.split("/").length;

    if (
      input.value == "" &&
      this.router.url.includes("shop") &&
      (splitUrl == 2 || splitUrl == 4)
    ) {
      this.router.navigate([], {
        queryParams: { name: null },
        queryParamsHandling: "merge"
      });
    } else if (input.value != "") {
      if (
        this.router.url.includes("shop") &&
        (splitUrl == 2 || splitUrl == 4)
      ) {
        this.router.navigate([], {
          queryParams: { name: input.value },
          queryParamsHandling: "merge"
        });
      } else {
        this.router.navigate(["/shop"], {
          queryParams: { name: input.value }
        });
      }
    }
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get searchValue(): string {
    return this._searchValue;
  }
}
