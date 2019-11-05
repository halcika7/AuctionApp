import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as CategoriesPageActions from '@app/containers/all-categories/store/all-categories.actions';
import { Categories } from '@app/containers/all-categories/store/all-categories.reducer';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.css']
})
export class AllCategoriesComponent implements OnInit {
  categories: Categories[] = [];

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select('categoriesPage').subscribe(({ categories }) => {
      this.categories = categories;
    });

    this.store.dispatch(new CategoriesPageActions.CategoriesStart());
  }
}
