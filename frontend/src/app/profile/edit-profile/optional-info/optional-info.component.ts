import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { emptyObject } from "@app/shared/checkEmptyObject";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";

@Component({
  selector: "app-optional-info",
  templateUrl: "./optional-info.component.html",
  styleUrls: ["./optional-info.component.scss"]
})
export class OptionalInfoComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store
      .select("profile")
      .subscribe(({ userInfo }) => {
        if (!emptyObject(userInfo)) {
          this.form.patchValue({
            street: userInfo.OptionalInfo.street,
            city: userInfo.OptionalInfo.city,
            country: userInfo.OptionalInfo.country,
            zip: userInfo.OptionalInfo.zip,
            state: userInfo.OptionalInfo.state
          });
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
