import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '@app/store/app.reducer';
import * as CategoriesPageActions from '@app/containers/all-categories/store/all-categories.actions';
import { Categories } from '@app/containers/all-categories/store/all-categories.reducer';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent implements OnInit {
  private _categories: Categories[] = [];

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select('categoriesPage').subscribe(({ categories }) => {
      this.categories = categories;
    });

    this.store.dispatch(new CategoriesPageActions.CategoriesStart());
  }

  set categories(categ: Categories[]) {
    this._categories = categ;
  }

  get categories(): Categories[] {
    return this._categories;
  }
}
