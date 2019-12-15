import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { ProfileService } from "./profile.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as ProfileActions from "./store/profile.actions";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit, AfterViewChecked, OnDestroy {
  private _lastBreadcrumbLink: string;
  private subscription = new Subscription();
  private _message: string;
  private _success: boolean;
  private _showNav: boolean = true;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.route.url.subscribe(data => {
        if (this.router.url === "/account") {
          this.router.navigateByUrl("/account/profile");
        }
        if (this.router.url === "/account/become-seller") {
          this._showNav = false;
        } else {
          this._showNav = true;
        }
      })
    );
    this.subscription.add(
      this.profileService.breadcrumbChanged.subscribe(value => {
        this._lastBreadcrumbLink = value;
      })
    );
    this.subscription.add(
      this.store
        .select("auth")
        .pipe(map(auth => auth.accessToken))
        .subscribe(accessToken => {
          if (
            !accessToken &&
            !localStorage.getItem("accessToken") &&
            !sessionStorage.getItem("accessToken")
          ) {
            this.router.navigate(["/home/auth/login"]);
          }
        })
    );
    this.subscription.add(
      this.store.select("profile").subscribe(({ message, success }) => {
        this._message = message;
        this._success = success;
      })
    );
  }

  ngOnDestroy() {
    this.store.dispatch(new ProfileActions.ClearProfile());
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  clearMessages() {
    this.store.dispatch(new ProfileActions.ClearProfileMessages());
  }

  get lastBreadcrumbLink(): string {
    return this._lastBreadcrumbLink;
  }

  get message(): string {
    return this._message;
  }

  get success(): boolean {
    return this._success;
  }

  get showNav(): boolean {
    return this._showNav;
  }
}
