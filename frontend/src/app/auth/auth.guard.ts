import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanDeactivate
} from "@angular/router";
import { Observable } from "rxjs";

import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select("auth").pipe(
      map(auth => {
        if (
          !auth.accessToken &&
          !localStorage.getItem("accessToken") &&
          !sessionStorage.getItem("accessToken")
        ) {
          this.router.navigate(["/home/auth/login"]);
          return false;
        }
        return true;
      })
    );
  }
}
