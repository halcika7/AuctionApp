import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as AuthActions from '@app/auth/store/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _isAuthenticated = null;
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store
      .select('auth')
      .subscribe(({ accessToken, loading, remember }) => {
        if (!loading) {
          if (accessToken && (localStorage.getItem('accessToken') || remember)) {
            this._isAuthenticated = true;
            localStorage.setItem('accessToken', accessToken);
          } else if (accessToken && (sessionStorage.getItem('accessToken') || !remember)) {
            this._isAuthenticated = true;
            sessionStorage.setItem('accessToken', accessToken);
          } else {
            this._isAuthenticated = false;
          }
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  protected logout() {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    this.store.dispatch(new AuthActions.LogoutStart());
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}
