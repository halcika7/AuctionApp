import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { emptyObject } from "@app/shared/checkEmptyObject";
import { Store } from "@ngrx/store";
import * as fromApp from "@app/store/app.reducer";

@Component({
  selector: "app-card-info",
  templateUrl: "./card-info.component.html",
  styleUrls: ["./card-info.component.scss"]
})
export class CardInfoComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() cardExp;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.select("profile").subscribe(({ userInfo, errors }) => {
      if (!emptyObject(userInfo)) {
        this.form.patchValue({
          cName: "",
          cNumber: "",
          CVC: ""
        });
      }
    });
  }

  showCardExp(): boolean {
    return !emptyObject(this.cardExp);
  }
}
