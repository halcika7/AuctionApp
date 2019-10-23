import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  type: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.type !== 'login' && params.type !== 'register') {
        this.router.navigate(['/404']);
      }

      this.type = params.type;
    });

    this.store
      .select('auth')
      .pipe(map(state => state.accessToken))
      .subscribe(token => {
        if (token) {
          this.router.navigate(['/404']);
        }
      });
  }
}
