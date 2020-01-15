import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { Auth } from "@app/auth/auth";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as AuthActions from "@app/auth/store/auth.actions";
import { Renderer2 } from "@angular/core";
import { jwtDecode } from "@app/shared/jwtDecode";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-activate-account",
  templateUrl: "./activate-account.component.html",
  styleUrls: ["./activate-account.component.scss"]
})
export class ActivateAccountComponent extends Auth
  implements OnInit, OnDestroy {
  private _subscription = new Subscription();
  private _activationToken: string;
  private _activateMessage: string;
  private _activationSuccess: boolean;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private render: Renderer2
  ) {
    super(store, new FormGroup({}), router, render);
    super.activateAccount = true;
  }

  ngOnInit() {
    this._subscription.add(
      this.route.queryParams.subscribe(({ activationToken }) => {
        if (activationToken) {
          this._activationToken = activationToken;
          sessionStorage.setItem("activationToken", activationToken);
          this.router.navigate([]);
        } else if (
          !activationToken &&
          (this._activationToken || sessionStorage.getItem("activationToken"))
        ) {
          const activationToken = this._activationToken
            ? this._activationToken
            : sessionStorage.getItem("activationToken");
          const decodedActivationToken = jwtDecode(activationToken);
          if (Object.keys(decodedActivationToken).length === 0) {
            this.router.navigate(["/404"]);
          } else if (Date.now() > decodedActivationToken.exp * 1000) {
            this._activateMessage = environment.ACTIVATION_TOKEN_EXPIRED;
            this._activationSuccess = false;
          } else if (Date.now() < decodedActivationToken.exp * 1000) {
            this.store.dispatch(
              new AuthActions.ActivateAccountStart({ activationToken })
            );
          }
        } else {
          this.router.navigate(["/404"]);
        }
      })
    );

    this._subscription.add(
      this.store.select("auth").subscribe(({ message, success }) => {
        this._activateMessage = message;
        this._activationSuccess = success;
        if (
          message == environment.MESSAGE_INVALID_TOKEN ||
          message == environment.MESSAGE_NO_TOKEN
        ) {
          this.router.navigate(["/404"]);
        }

        if(success) {
          sessionStorage.removeItem('activationToken');
        }
      })
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    super.destroy();
  }

  get activateMessage(): string {
    return this._activateMessage;
  }

  get activationSuccess(): boolean {
    return this._activationSuccess;
  }
}
