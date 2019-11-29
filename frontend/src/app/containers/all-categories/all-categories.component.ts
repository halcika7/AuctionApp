import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";
import * as CategoriesPageActions from "@app/containers/all-categories/store/all-categories.actions";
import { Categories } from "@app/containers/all-categories/store/all-categories.reducer";

@Component({
  selector: "app-all-categories",
  templateUrl: "./all-categories.component.html",
  styleUrls: ["./all-categories.component.scss"]
})
export class AllCategoriesComponent implements OnInit, OnDestroy {
  private _categories: Categories[] = [];
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select("categoriesPage").subscribe(({ categories }) => {
      this._categories = categories;
    });

    this.store.dispatch(new CategoriesPageActions.CategoriesStart());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get categories(): Categories[] {
    return this._categories;
  }
}
