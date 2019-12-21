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
      .subscribe(({ userInfo, errors }) => {
        if (!emptyObject(userInfo)) {
          this.form.patchValue({
            street: emptyObject(errors)
              ? userInfo.OptionalInfo.street
              : this.form.value.street,
            city: emptyObject(errors)
              ? userInfo.OptionalInfo.city
              : this.form.value.city,
            country: emptyObject(errors)
              ? userInfo.OptionalInfo.country
              : this.form.value.country,
            zip: emptyObject(errors)
              ? userInfo.OptionalInfo.zip
              : this.form.value.zip,
            state: emptyObject(errors)
              ? userInfo.OptionalInfo.state
              : this.form.value.state
          });
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
