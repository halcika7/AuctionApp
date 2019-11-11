import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _notFound = false;

  constructor(
    private location: Location,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.location.path() === '/404') {
          this._notFound = true;
        } else {
          this._notFound = false;
        }
      });
    if (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')) {
      this.store.dispatch(new AuthActions.RefreshTokenStart());
    }
  }

  get notFound(): boolean {
    return this._notFound;
  }
}
