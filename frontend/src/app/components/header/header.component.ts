import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as AuthActions from '@app/auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select('auth').subscribe(data => {
      if (data.accessToken) {
        this.isAuthenticated = true;
        data.remember || localStorage.getItem('accessToken')
          ? localStorage.setItem('accessToken', data.accessToken)
          : sessionStorage.setItem('accessToken', data.accessToken);
      } else {
        this.isAuthenticated = false;
      }
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
