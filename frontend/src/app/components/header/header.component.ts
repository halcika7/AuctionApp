import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../../auth/store/auth.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store
      .select('auth')
      .pipe(map(storeData => (storeData.accessToken ? true : false)))
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  clicked(e: Event) {
    e.preventDefault();
  }

  logout() {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    this.store.dispatch(new AuthActions.LogoutStart());
  }
}
