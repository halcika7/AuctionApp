import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as AuthActions from '@app/auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private _isAuthenticated = null;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select('auth').subscribe(({ accessToken, remember, loading }) => {
      if (!loading) {
        if (accessToken && (localStorage.getItem('accessToken') || remember)) {
          this.isAuthenticated = true;
          localStorage.setItem('accessToken', accessToken);
        } else if (accessToken && (sessionStorage.getItem('accessToken') || !remember)) {
          this.isAuthenticated = true;
          sessionStorage.setItem('accessToken', accessToken);
        } else {
          this.isAuthenticated = false;
        }
      }
    });
  }

  logout() {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    this.store.dispatch(new AuthActions.LogoutStart());
  }

  set isAuthenticated(val: boolean) {
    this._isAuthenticated = val;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}
